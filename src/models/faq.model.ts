import {belongsTo, Entity, model, property} from '@loopback/repository';
import {FaqCategory} from './faq-category.model';

@model()
export class Faq extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  question?: string;

  @property({
    type: 'string',
  })
  answer?: string;


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

  @belongsTo(() => FaqCategory)
  faqCategoryId: number;

  constructor(data?: Partial<Faq>) {
    super(data);
  }
}

export interface FaqRelations {
  // describe navigational properties here
}

export type FaqWithRelations = Faq & FaqRelations;
