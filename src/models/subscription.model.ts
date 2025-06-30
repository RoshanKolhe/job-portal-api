import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Plan} from './plan.model';
import {User} from './user.model';

@model()
export class Subscription extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
    required: true
  })
  paymentMethod: number;  // 0 for stripe, 1 for razorpay

  @property({
    type: 'object',
  })
  paymentDetails: object;

  @property({
    type: 'object',
  })
  planData : object;

  @property({
    type: 'date'
  })
  expiryDate?: Date;
  
  @belongsTo(() => Plan)
  planId: number;

  @belongsTo(() => User)
  userId: number;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'date',
  })
  deletedAt?: Date;

  @property({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;

  constructor(data?: Partial<Subscription>) {
    super(data);
  }
}

export interface SubscriptionRelations {
  // describe navigational properties here
}

export type SubscriptionWithRelations = Subscription & SubscriptionRelations;
