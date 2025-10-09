import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Courses} from './courses.model';

@model()
export class Plan extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true
  })
  planType: number; // 0 for data science, 1 for marketing, 2 for product management

  @property({
    type: 'number',
    required: true
  })
  planGroup: number; // 0 for course, 1 for service

  @belongsTo(() => Courses)
  coursesId: number;

  @property({
    type: 'number',
    required: true
  })
  price: number;

  @property({
    type: 'string',
  })
  format: string;

  @property({
    type: 'string',
  })
  effort: string;

  @property({
    type: 'string',
    required: true
  })
  paymentType: string;  // oneTime, recurring

  @property({
    type: 'string',
  })
  recurringPeriod: string;  // monthly, yearly, weekly

  @property({
    type: 'number',
  })
  days: number;   // monthly - 28days, yearly - 365 days, weekly - 7days

  @property({
    type: 'boolean',
    default: false
  })
  isFreePlan: boolean;

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
  constructor(data?: Partial<Plan>) {
    super(data);
  }
}

export interface PlanRelations {
  // describe navigational properties here
}

export type PlanWithRelations = Plan & PlanRelations;
