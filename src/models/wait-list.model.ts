import {Entity, model, property} from '@loopback/repository';

@model()
export class WaitList extends Entity {
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
  email: string;

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




  constructor(data?: Partial<WaitList>) {
    super(data);
  }
}

export interface WaitListRelations {
  // describe navigational properties here
}

export type WaitListWithRelations = WaitList & WaitListRelations;
