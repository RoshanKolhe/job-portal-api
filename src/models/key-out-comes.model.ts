import {Entity, model, property} from '@loopback/repository';

@model()
export class KeyOutComes extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  heading?: string;

  @property({
    type: 'string'
  })
  description?: string;

  @property({
    type: 'object',
  })
  image?: object;

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


  constructor(data?: Partial<KeyOutComes>) {
    super(data);
  }
}

export interface KeyOutComesRelations {
  // describe navigational properties here
}

export type KeyOutComesWithRelations = KeyOutComes & KeyOutComesRelations;
