import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Courses} from './courses.model';

@model()
export class PlansFaq extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  answer: string;

  @property({
    type: 'string',
    required: true,
  })
  question: string;

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

  @property({
    type: 'number',
  })
  coursesId?: number;

  constructor(data?: Partial<PlansFaq>) {
    super(data);
  }
}

export interface PlansFaqRelations {
  // describe navigational properties here
}

export type PlansFaqWithRelations = PlansFaq & PlansFaqRelations;
