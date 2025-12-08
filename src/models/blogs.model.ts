import {Entity, hasMany, model, property} from '@loopback/repository';
import {CategoryBlogsLink} from './category-blogs-link.model';
import {Category} from './category.model';

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
  })
  authorName: string;

  @property({
    type: 'string',
  })
  designation: string;

  @property({
    type: 'string',
  })
  blogType: string;

  @property({
    type: 'string',
  })
  companyUrl?: string;

  @property({
    type: 'string',
  })
  authorImage: string;

  @property({
    type: 'string',
    required: true,
    limit: 1000,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
    mysql: {datatype: 'longtext'},
  })
  content: string;

  @property({
    type: 'string',
  })
  coverUrl: string;

  @property({
    type: 'string',
  })
  coverAlt: string;

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
    type: 'string',
  })
  metaTitle: string;

  @property({
    type: 'string',
  })
  metaDescription: string;

  @property({
    type: 'string',
  })
  canonicalURL: string;

  @property({
    type: 'boolean'
  })
  isIndexed: boolean;

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

  @hasMany(() => Category, {through: {model: () => CategoryBlogsLink}})
  categories: Category[];

  constructor(data?: Partial<Blogs>) {
    super(data);
  }
}

export interface BlogsRelations {
  // describe navigational properties here
}

export type BlogsWithRelations = Blogs & BlogsRelations;
