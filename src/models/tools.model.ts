import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Courses} from './courses.model';

@model()
export class Tools extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  toolName?: string;

  @property({
    type: 'string',
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

  @property({
    type: 'number',
  })
  coursesId?: number;

  constructor(data?: Partial<Tools>) {
    super(data);
  }
}

export interface ToolsRelations {
  // describe navigational properties here
}

export type ToolsWithRelations = Tools & ToolsRelations;
