import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
  RestBindings,
  Response,
} from '@loopback/rest';
import { Subscription } from '../models';
import { PlanRepository, SubscriptionRepository, UserRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';
import { StripeService } from '../services/stripe.service';
import Stripe from 'stripe';
import { RazorPayService } from '../services/razorpay.service';
import * as crypto from 'crypto';
const Razorpay = require('razorpay');

export class SubscriptionController {
  private stripe: Stripe;
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    private res: Response,
    @repository(SubscriptionRepository)
    public subscriptionRepository: SubscriptionRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(PlanRepository)
    public planRepository: PlanRepository,
    @inject('service.stripe.service')
    public stripeService: StripeService,
    @inject('service.razorpay.service')
    public razorpayService: RazorPayService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
        PermissionKeys.CUSTOMER
      ]
    }
  })
  @post('/subscriptions')
  @response(200, {
    description: 'Subscription model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Subscription) } },
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscription, {
            title: 'NewSubscription',
            exclude: ['id'],
          }),
        },
      },
    })
    subscription: Omit<Subscription, 'id'>,
  ): Promise<{ success: boolean; paymentMethod: number; paymentObject: object }> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.Unauthorized('Access denied');
      }

      if (!subscription.planId) {
        throw new HttpErrors.BadGateway('Plan details not found in request body');
      }

      const plan = await this.planRepository.findById(subscription.planId);
      if (!plan) {
        throw new HttpErrors.NotFound(`Plan with planId ${subscription.planId} not found`);
      }

      const newSubscriptionData = {
        planId: subscription.planId,
        userId: user.id,
        status: 'pending',
        paymentMethod: subscription.paymentMethod,
        planData: plan,
      };

      const newSubscription = await this.subscriptionRepository.create(newSubscriptionData);

      const checkOutData = {
        ...newSubscription,
        // ...plan,
        // ...user,
      };

      let response;

      if (newSubscription.paymentMethod === 0) {
        response = await this.stripeService.createCheckoutSession(checkOutData);
      } else if (newSubscription.paymentMethod === 1) {
        response = await this.razorpayService.createOrder(checkOutData);
      } else {
        throw new HttpErrors.BadRequest('Invalid payment method selected');
      }

      return {
        success: true,
        paymentMethod: newSubscription.paymentMethod,
        paymentObject: response,
      };
    } catch (error) {
      throw error;
    }
  }

  @post('/subscriptions/callback/verify')
  async verifyRazorpayPayment(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              subscription_id: { type: 'number' },
              razorpay_order_id: { type: 'string' },
              razorpay_payment_id: { type: 'string' },
              razorpay_signature: { type: 'string' },
            },
            required: [
              'subscription_id',
              'razorpay_order_id',
              'razorpay_payment_id',
              'razorpay_signature',
            ],
          },
        },
      },
    })
    body: {
      subscription_id: number;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
  ): Promise<void> {
    const { subscription_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    const subscription = await this.subscriptionRepository.findById(subscription_id);
    if (!subscription) {
      throw new HttpErrors.NotFound('Subscription not found');
    }

    if (!secret) {
      throw new HttpErrors.InternalServerError('Razorpay secret key not configured');
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');

    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: secret,
      });

      const payment = await razorpay.payments.fetch(razorpay_payment_id);

      const paymentDetails = {
        order_id: payment.order_id,
        payment_id: payment.id,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
      };

      if (digest === razorpay_signature && payment.status === 'captured') {
        const plan = await this.planRepository.findById(subscription.planId);

        const updateData: Partial<typeof subscription> = {
          paymentDetails,
          status: 'success',
        };

        if (plan) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + plan.days);
          updateData.expiryDate = expiryDate;
        }

        await this.subscriptionRepository.updateById(subscription.id, updateData);
        await this.userRepository.updateById(subscription.userId, {
          activeSubscriptionId: subscription.id,
          currentPlanId: subscription.planId,
        });

        this.res.redirect(`http://localhost:3030/payment/success?subscriptionId=${subscription.id}`);
      } else {
        // Invalid signature or payment failed
        await this.subscriptionRepository.updateById(subscription.id, {
          paymentDetails,
          status: 'failed',
        });

        this.res.redirect(`http://localhost:3030/payment/cancel?subscriptionId=${subscription.id}`);
      }
    } catch (error) {
      console.error('Razorpay verify error:', error);
      await this.subscriptionRepository.updateById(subscription.id, {
        status: 'failed',
      });
      this.res.redirect(`http://localhost:3030/payment/cancel?subscriptionId=${subscription.id}`);
    }
  }

  // Payment confirmation route function. 
  @get('/subscriptions/callbackurl/{id}')
  async redirectUrl(
    @param.path.string('id') id: number,
    @param.query.string('session_id') sessionId: string,
    @requestBody() request: any, // Adjust the type if you have a specific type
    @inject(RestBindings.Http.RESPONSE) res: Response
  ): Promise<void> {
    try {
      const subscription = await this.subscriptionRepository.findById(id);

      if (!subscription) {
        throw new HttpErrors[500];
      }

      // Fetch session data from Stripe
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      console.log('session data', session);
      console.log('subscription data', subscription);
      if (session.payment_status === 'paid' && session.status === 'complete') {
        const plan = await this.planRepository.findById(subscription.planId);
        console.log('plan data', plan);
        if (!plan) {
          await this.subscriptionRepository.updateById(subscription.id, { paymentDetails: session, status: 'success' });
          await this.userRepository.updateById(subscription.userId, { activeSubscriptionId: subscription.id, currentPlanId: subscription.planId });
          res.redirect(`${process.env.REACT_APP_SITE_URL}/payment/success?subscriptionId=${id}`);
        } else {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + plan.days);
          console.log('entered here')
          await this.subscriptionRepository.updateById(subscription.id, { paymentDetails: session, status: 'success', expiryDate: expiryDate });
          console.log('user data updated and redirected to success');
          await this.userRepository.updateById(subscription.userId, { activeSubscriptionId: subscription.id, currentPlanId: subscription.planId });
          console.log('subscription data updated and redirected to success');
          res.redirect(`http://localhost:3030/payment/success?subscriptionId=${id}`);
        }
      } else {
        await this.subscriptionRepository.updateById(subscription.id, { paymentDetails: session, status: 'failed' });
        res.redirect(`http://localhost:3030/payment/cancel?subscriptionId=${id}`);
      }

    } catch (error) {
      console.log(error);
    }
  }

  // payment cancel route function. 
  @get('/subscriptions/cancel/callbackurl/{id}')
  async redirectCancelUrl(
    @param.path.string('id') id: number,
    @requestBody() request: any,
  ): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(id);

    if (!subscription) {
      throw new HttpErrors[500];
    }
    await this.subscriptionRepository.updateById(subscription.id, { status: 'failed' });

    this.res.redirect(`http://localhost:3030/payment/cancel?subscriptionId=${id}`);
  }

  @get('/subscriptions/count')
  @response(200, {
    description: 'Subscription model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Subscription) where?: Where<Subscription>,
  ): Promise<Count> {
    return this.subscriptionRepository.count(where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
      ]
    }
  })
  @get('/subscriptions')
  @response(200, {
    description: 'Array of Subscription model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Subscription, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Subscription) filter?: Filter<Subscription>,
  ): Promise<Subscription[]> {
    return this.subscriptionRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
        PermissionKeys.CUSTOMER
      ]
    }
  })
  @get('/subscriptions/user')
  @response(200, {
    description: 'Array of Subscription model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Subscription, { includeRelations: true }),
        },
      },
    },
  })
  async findByUser(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<Subscription[]> {
    try{
      const user = await this.userRepository.findById(currentUser.id);

      if(!user){
        throw new HttpErrors.Unauthorized('Unauthorized access');
      }

      const subscriptions = await this.subscriptionRepository.find({where : {userId: user.id}});

      return subscriptions;
    }catch(error){
      throw error;
    }
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
      ]
    }
  })
  @patch('/subscriptions')
  @response(200, {
    description: 'Subscription PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscription, { partial: true }),
        },
      },
    })
    subscription: Subscription,
    @param.where(Subscription) where?: Where<Subscription>,
  ): Promise<Count> {
    return this.subscriptionRepository.updateAll(subscription, where);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
        PermissionKeys.CUSTOMER
      ]
    }
  })
  @get('/subscriptions/{id}')
  @response(200, {
    description: 'Subscription model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Subscription, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Subscription, { exclude: 'where' }) filter?: FilterExcludingWhere<Subscription>
  ): Promise<Subscription> {
    return this.subscriptionRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
      ]
    }
  })
  @patch('/subscriptions/{id}')
  @response(204, {
    description: 'Subscription PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Subscription, { partial: true }),
        },
      },
    })
    subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.updateById(id, subscription);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
      ]
    }
  })
  @put('/subscriptions/{id}')
  @response(204, {
    description: 'Subscription PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() subscription: Subscription,
  ): Promise<void> {
    await this.subscriptionRepository.replaceById(id, subscription);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN,
      ]
    }
  })
  @del('/subscriptions/{id}')
  @response(204, {
    description: 'Subscription DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.subscriptionRepository.deleteById(id);
  }

  // fetching subscriptions by user
  // @authenticate({
  //   strategy: 'jwt',
  //   options: {
  //     required : [
  //       PermissionKeys.ADMIN,
  //       PermissionKeys.CUSTOMER
  //     ]
  //   }
  // })
  // @get('subscriptions/subscriptions-by-user')

}
