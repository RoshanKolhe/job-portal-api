import { Entity, model, property } from '@loopback/repository';

@model()
export class SavedJobsUsersLink extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true
  })
  jobsId: number;

  @property({
    type: 'number',
    required: true
  })
  userId: number;

  @property({
    type: 'boolean',
    required: true
  })
  isSaved: boolean;

  @property({
    type: 'boolean',
    required: true
  })
  isApplied: boolean;

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
  constructor(data?: Partial<SavedJobsUsersLink>) {
    super(data);
  }
}

export interface SavedJobsUsersLinkRelations {
  // describe navigational properties here
}

export type SavedJobsUsersLinkWithRelations = SavedJobsUsersLink & SavedJobsUsersLinkRelations;
