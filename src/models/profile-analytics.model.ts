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
  })
  relevant_job_class?: string;

  @property({
    type: 'number'
    })
  FOBO_Score?: number;

  @property({
    type: 'number'
    })
  Augmented_Score?: number;

  @property({
    type: 'string'
    })
  Augmentation_Comment?: string;

  @property({
    type: 'number'
    })
  Automated_Score?: number;

  @property({
    type: 'string'
    })
  Automated_Comment?: string;

  @property({
    type: 'number'
    })
  Human_Score?: number;

  @property({
    type: 'string'
    })
  Human_Comment?: string;

  @property({
    type: 'object'
    })
  Comment?: object;

  @property({
    type: 'array',
    itemType: 'object'
    })
  Strategy?: object[];

  @property({
    type: 'array',
    itemType: 'string'
    })
  Task_Distribution_Automation?: string[];

  @property({
    type: 'array',
    itemType: 'string'
    })
  Task_Distribution_Human?: string[];

  @property({
    type: 'array',
    itemType: 'string'
    })
  Task_Distribution_Augmentation?: string[];

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
    type: 'string',
  })
  linkedInUrl: string;

  @belongsTo(() => Resume)
  resumeId: number;

  @belongsTo(() => User)
  userId: number;

  constructor(data?: Partial<ProfileAnalytics>) {
    super(data);
  }
}

export interface ProfileAnalyticsRelations {
  // describe navigational properties here
}

export type ProfileAnalyticsWithRelations = ProfileAnalytics &
  ProfileAnalyticsRelations;
