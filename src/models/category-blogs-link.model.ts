import {Entity, model, property} from '@loopback/repository';

@model()
export class CategoryBlogsLink extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type:'number',
    required: true,
  })
  categoryId: number;

  @property({
    type: 'number',
    required: true,
  })
  blogsId: number;

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
  constructor(data?: Partial<CategoryBlogsLink>) {
    super(data);
  }
}

export interface CategoryBlogsLinkRelations {
  // describe navigational properties here
}

export type CategoryBlogsLinkWithRelations = CategoryBlogsLink & CategoryBlogsLinkRelations;
