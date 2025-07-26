import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Blogs} from './blogs.model';
import {User} from './user.model';

@model()
export class Comments extends Entity {
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
  commentType: string;

  @property({
    type: 'string',
  })
  comment: string;

  @property({
    type: 'object',
  })
  audio: object;

  @property({
    type: 'boolean',
    required: true
  })
  isParentComment: boolean;

  @property({
    type: 'number',
  })
  repliedCommentId: number;

  @property({
    type: 'date',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @belongsTo(() => Blogs)
  blogsId: number;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<Comments>) {
    super(data);
  }
}

export interface CommentsRelations {
  // describe navigational properties here
}

export type CommentsWithRelations = Comments & CommentsRelations;
