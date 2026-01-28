import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  Request,
  requestBody,
  response,
  Response,
  RestBindings,
} from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import * as crypto from 'crypto';
import Stripe from 'stripe';
import { PermissionKeys } from '../authorization/permission-keys';
import { Subscription } from '../models';
import { PlanRepository, SubscriptionRepository, UserRepository } from '../repositories';
import { RazorPayService } from '../services/razorpay.service';
import { StripeService } from '../services/stripe.service';
import { CurrencyExchange } from '../services/currency.service';
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
    @inject('service.currency.service')
    public currencyExchangeService: CurrencyExchange
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
    console.log('subscription', subscription);
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.Unauthorized('Access denied');
      }

      if (!subscription.planId) {
        throw new HttpErrors.BadGateway('Plan details not found in request body');
      }

      const plan = await this.planRepository.findById(subscription.planId, { include: [{ relation: 'courses' }, { relation: 'services' }] });
      if (!plan) {
        throw new HttpErrors.NotFound(`Plan with planId ${subscription.planId} not found`);
      }
      let calculatedPrice = plan.price;
      if (subscription.currencyType === 1) {
        calculatedPrice = await this.currencyExchangeService.exchangeToUSD(plan.price);
      }

      const newSubscriptionData = {
        planId: subscription.planId,
        userId: user.id,
        status: 'pending',
        paymentMethod: subscription.paymentMethod,
        planData: {
          ...plan,
          price: Number(calculatedPrice)
        },
        currencyType: subscription.currencyType
      };

      const newSubscription = await this.subscriptionRepository.create(newSubscriptionData);

      const checkOutData = {
        ...newSubscription,
        userData: {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber?.toString()
        }
        // ...plan,
        // ...user,
      };

      console.log('checkoutData', checkOutData);
      let response;

      if (newSubscription.paymentMethod === 0) {
        response = await this.stripeService.createCheckoutSession(checkOutData);
      } else if (newSubscription.paymentMethod === 1) {
        response = await this.razorpayService.createPaymentLink(checkOutData);
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
  
  @get('/subscriptions/callback/verify')
  async verifyRazorpayRedirect(
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {

    const FRONTEND = process.env.REACT_APP_SITE_URL || 'http://localhost:3000';

    try {
      const {
        razorpay_payment_id,
        razorpay_payment_link_id,
        razorpay_payment_link_reference_id,
      } = req.query as any;

      if (!razorpay_payment_id || !razorpay_payment_link_id || !razorpay_payment_link_reference_id) {
        console.error('Missing Razorpay params', req.query);
        return res.redirect(`${FRONTEND}/payment/failed`);
      }

      const subscriptionId = Number(String(razorpay_payment_link_reference_id).trim());
      if (!subscriptionId) {
        console.error('Invalid reference id', razorpay_payment_link_reference_id);
        return res.redirect(`${FRONTEND}/payment/failed`);
      }

      const subscription = await this.subscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        console.error('Subscription not found', subscriptionId);
        return res.redirect(`${FRONTEND}/payment/failed`);
      }

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      // ✅ Fetch payment
      const payment = await razorpay.payments.fetch(String(razorpay_payment_id));

      if (payment.status !== 'captured') {
        console.error('Payment not captured', payment.status);
        await this.subscriptionRepository.updateById(subscription.id, {
          status: 'failed',
          paymentDetails: payment,
        });
        return res.redirect(`${FRONTEND}/payment/failed?subscriptionId=${subscription.id}`);
      }

      // ✅ Fetch payment link
      const paymentLink = await razorpay.paymentLink.fetch(String(razorpay_payment_link_id));

      // ✅ Validate mapping
      if (String(paymentLink.reference_id) !== String(subscriptionId)) {
        console.error('Reference ID mismatch', paymentLink.reference_id, subscriptionId);
        return res.redirect(`${FRONTEND}/payment/failed`);
      }

      const paymentDetails = {
        payment_id: payment.id,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        amount: payment.amount,
        currency: payment.currency,
        payment_link_id: paymentLink.id,
        livemode: payment.livemode,
      };

      // ✅ Activate subscription
      const plan = await this.planRepository.findById(subscription.planId);
      if (!plan) {
        console.error('Plan not found', subscription.planId);
        return res.redirect(`${FRONTEND}/payment/failed`);
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + plan.days);

      await this.subscriptionRepository.updateById(subscription.id, {
        paymentDetails,
        status: 'success',
        expiryDate,
      });

      await this.userRepository.updateById(subscription.userId, {
        activeSubscriptionId: subscription.id,
        currentPlanId: subscription.planId,
      });

      return res.redirect(`${FRONTEND}/payment/success?subscriptionId=${subscription.id}`);

    } catch (err) {
      console.error('Razorpay verify error:', err);
      return res.redirect(`${FRONTEND}/payment/failed`);
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

  // @get('/subscriptions/count')
  // @response(200, {
  //   description: 'Subscription model count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async count(
  //   @param.where(Subscription) where?: Where<Subscription>,
  // ): Promise<Count> {
  //   return this.subscriptionRepository.count(where);
  // }

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
    return this.subscriptionRepository.find({ ...filter, include: [{ relation: 'user' }] });
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
    try {
      const user = await this.userRepository.findById(currentUser.id);

      if (!user) {
        throw new HttpErrors.Unauthorized('Unauthorized access');
      }

      const subscriptions = await this.subscriptionRepository.find(
        {
          where: {
            userId: user.id
          },
          include: ['user'],
        }
      );

      return subscriptions;
    } catch (error) {
      throw error;
    }
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: {
  //     required: [
  //       PermissionKeys.ADMIN,
  //     ]
  //   }
  // })
  // @patch('/subscriptions')
  // @response(200, {
  //   description: 'Subscription PATCH success count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Subscription, { partial: true }),
  //       },
  //     },
  //   })
  //   subscription: Subscription,
  //   @param.where(Subscription) where?: Where<Subscription>,
  // ): Promise<Count> {
  //   return this.subscriptionRepository.updateAll(subscription, where);
  // }



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
        schema: getModelSchemaRef(Subscription, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Subscription, { exclude: 'where' }) filter?: FilterExcludingWhere<Subscription>
  ): Promise<Subscription> {
    const updatedFilter: FilterExcludingWhere<Subscription> = {
      ...filter,
      include: [
        ...(filter?.include ?? []),
        { relation: 'user' },
      ]
    };
    return this.subscriptionRepository.findById(id, updatedFilter);
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

  // @authenticate({
  //   strategy: 'jwt',
  //   options: {
  //     required: [
  //       PermissionKeys.ADMIN,
  //     ]
  //   }
  // })
  // @put('/subscriptions/{id}')
  // @response(204, {
  //   description: 'Subscription PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() subscription: Subscription,
  // ): Promise<void> {
  //   await this.subscriptionRepository.replaceById(id, subscription);
  // }

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

  // Fetching service subscription by user
  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER]
    }
  })
  @get('/subscriptions/service-subscriptions-by-user/{page}')
  async fetchServiceSubscriptionByUser(
    @param.path.string('page') page: string,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<{ success: boolean; message: string; subscriptionId: number | null | undefined }> {
    try {
      const userSubscriptions = await this.subscriptionRepository.find({
        where: {
          and: [
            { userId: currentUser.id },
            { status: 'success' },
          ],
        },
      });

      const findServiceSubscription = userSubscriptions.find(
        (subscription: any) =>
          subscription.planData?.planGroup === 1 &&
          subscription.planData?.services?.page?.includes(page)
      );

      if (!findServiceSubscription || (findServiceSubscription && !findServiceSubscription.id)) {
        return {
          success: false,
          message: `No purchased service found for "${page}"`,
          subscriptionId: null,
        };
      }

      return {
        success: true,
        message: 'Subscription found',
        subscriptionId: findServiceSubscription.id,
      };
    } catch (error) {
      console.error('Error while fetching subscription:', error);
      throw error;
    }
  }
}
