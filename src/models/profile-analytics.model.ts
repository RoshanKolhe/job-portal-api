import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Resume} from './resume.model';
import {User} from './user.model';

@model()
export class ProfileAnalytics extends Entity {
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
  relevant_job_class: string;

  @property({
    type: 'number',
    required: true,
  })
  FOBO_Score: number;

  @property({
    type: 'number',
    required: true,
  })
  Augmented_Score: number;

  @property({
    type: 'string',
    required: true,
  })
  Augmentation_Comment: string;

  @property({
    type: 'number',
    required: true,
  })
  Automated_Score: number;

  @property({
    type: 'string',
    required: true,
  })
  Automated_Comment: string;

  @property({
    type: 'number',
    required: true,
  })
  Human_Score: number;

  @property({
    type: 'string',
    required: true,
  })
  Human_Comment: string;

  @property({
    type: 'object',
    required: true,
  })
  Comment: object;

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  Strategy: object[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  Task_Distribution_Automation: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  Task_Distribution_Human: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  Task_Distribution_Augmentation: string[];

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Resume)
  resumeId: number;

  constructor(data?: Partial<ProfileAnalytics>) {
    super(data);
  }
}

export interface ProfileAnalyticsRelations {
  // describe navigational properties here
}

export type ProfileAnalyticsWithRelations = ProfileAnalytics &
  ProfileAnalyticsRelations;
