import { Entity, model, property } from '@loopback/repository';

@model()
export class Courses extends Entity {
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
  lmsId: string;

  @property({
    type: 'string',
    required: true
  })
  courseName: string;

  @property({
    type: 'object',
    required: true
  })
  thumbnail: object;

  @property({
    type: 'array',
    itemType: 'string'
  })
  features: string[];

  @property({
    type: 'string'
  })
  description: string;

  @property({
    type: 'string'
  })
  courseDuration: string;

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
    type: 'boolean',
    default: true,
  })
  isActive: boolean;
  constructor(data?: Partial<Courses>) {
    super(data);
  }
}

export interface CoursesRelations {
  // describe navigational properties here
}

export type CoursesWithRelations = Courses & CoursesRelations;
