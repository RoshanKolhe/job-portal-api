import { Entity, model, property, belongsTo} from '@loopback/repository';
import {Plan} from './plan.model';

@model()
export class CourseRegistrationInterest extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  fullName: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  companyName: string;

  @property({
    type: 'string',
    required: true
  })
  designation: string;

  @property({
    type: 'boolean',
  })
  isActive?: boolean;

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

  @belongsTo(() => Plan)
  planId: number;

  constructor(data?: Partial<CourseRegistrationInterest>) {
    super(data);
  }
}

export interface CourseRegistrationInterestRelations {
  // describe navigational properties here
}

export type CourseRegistrationInterestWithRelations = CourseRegistrationInterest & CourseRegistrationInterestRelations;
