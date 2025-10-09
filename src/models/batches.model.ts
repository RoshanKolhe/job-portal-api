import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Plan} from './plan.model';

@model()
export class Batches extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'date',
  })
  startDate?: Date;

  @property({
    type: 'date',
  })
  endDate?: Date;

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

  constructor(data?: Partial<Batches>) {
    super(data);
  }
}

export interface BatchesRelations {
  // describe navigational properties here
}

export type BatchesWithRelations = Batches & BatchesRelations;
