import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Resume } from './resume.model';

@model()
export class RunningAnalytics extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @belongsTo(() => Resume)
  resumeId: number;

  @property({
    type: 'boolean',
    default: false
  })
  isFoboPro: boolean;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      enum: [0, 1, 2, 3] // 0 => created 1 => processing 2 => success 3 => errored
    }
  })
  status: number;

  @property({
    type: 'number',
    required: true,
  })
  trialCount: number;

  @property({
    type: 'string',
    mysql: { datatype: 'longtext' }
  })
  error?: string;

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
  constructor(data?: Partial<RunningAnalytics>) {
    super(data);
  }
}

export interface RunningAnalyticsRelations {
  // describe navigational properties here
}

export type RunningAnalyticsWithRelations = RunningAnalytics & RunningAnalyticsRelations;
