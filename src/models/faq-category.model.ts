import {Entity, model, property, hasMany} from '@loopback/repository';
import {Faq} from './faq.model';

@model()
export class FaqCategory extends Entity {
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
  categoryName: string;

  @property({
    type: 'string',
  })
  description?: string;

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

  @hasMany(() => Faq)
  faqs: Faq[];

  constructor(data?: Partial<FaqCategory>) {
    super(data);
  }
}

export interface FaqCategoryRelations {
  // describe navigational properties here
}

export type FaqCategoryWithRelations = FaqCategory & FaqCategoryRelations;
