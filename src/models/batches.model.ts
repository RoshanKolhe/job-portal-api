import {Entity, model, property} from '@loopback/repository';

@model()
export class Batches extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;




  constructor(data?: Partial<Batches>) {
    super(data);
  }
}

export interface BatchesRelations {
  // describe navigational properties here
}

export type BatchesWithRelations = Batches & BatchesRelations;
