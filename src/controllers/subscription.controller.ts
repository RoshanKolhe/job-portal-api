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
  ): Promise<any> {
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
        planData: plan
      };

      const newSubscription = await this.subscriptionRepository.create(newSubscriptionData);

      const checkOutData = {
        ...newSubscription,
        ...plan,
        ...user
      }

      const response = await this.stripeService.createCheckoutSession(checkOutData);

      return response;
    } catch (error) {
      throw error;
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

      if(!subscription){
        throw new HttpErrors[500];
      }

      // Fetch session data from Stripe
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid' && session.status === 'complete') {
        const plan = await this.planRepository.findById(subscription.planId);
        if (!plan) {
          await this.subscriptionRepository.updateById(subscription.id, { paymentDetails: session, status: 'success' });
          await this.userRepository.updateById(subscription.userId, { activeSubscriptionId: subscription.id, currentPlanId: subscription.planId });
          res.redirect(`${process.env.REACT_APP_SITE_URL}/payment/success?subscriptionId=${id}`);
        } else {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + plan.days);
          await this.subscriptionRepository.updateById(subscription.id, { paymentDetails: session, status: 'success', expiryDate: expiryDate });
          await this.userRepository.updateById(subscription.userId, { activeSubscriptionId: subscription.id,  currentPlanId: subscription.planId });
          res.redirect(`${process.env.REACT_APP_SITE_URL}/payment/success?subscriptionId=${id}`);
        }
      } else {
        await this.subscriptionRepository.updateById(subscription.id, { paymentDetails: session, status: 'failed' });
        res.redirect(`${process.env.REACT_APP_SITE_URL}/payment/cancel?subscriptionId=${id}`);
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

    this.res.redirect(`${process.env.REACT_APP_SITE_URL}/payment/cancel?subscriptionId=${id}`);
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
