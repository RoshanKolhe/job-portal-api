import {Entity, model, property} from '@loopback/repository';

@model()
export class Blogs extends Entity {
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
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;
  @property({
    type: 'string',
    required: true,
  })
  content: string;

  @property({
    type: 'string',
    required: true,
  })
  coverUrl: string;

  @property({
    type: 'string',
  })
  slug?: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  tags: string[];

  @property({
    type: 'string',
    default: 'draft',
  })
  publish?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  isEnableComments: boolean;


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


  constructor(data?: Partial<Blogs>) {
    super(data);
  }
}

export interface BlogsRelations {
  // describe navigational properties here
}

export type BlogsWithRelations = Blogs & BlogsRelations;
