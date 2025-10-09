import {Entity, model, property} from '@loopback/repository';

@model()
export class ProgramModule extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string'
  })
  moduleName: string;

  @property({
    type: 'array',
    itemType: 'string'
  })
  modules: string[];

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

  constructor(data?: Partial<ProgramModule>) {
    super(data);
  }
}

export interface ProgramModuleRelations {
  // describe navigational properties here
}

export type ProgramModuleWithRelations = ProgramModule & ProgramModuleRelations;
