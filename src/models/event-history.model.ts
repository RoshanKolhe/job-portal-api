import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';
import {Resume} from './resume.model';

@model()
export class EventHistory extends Entity {
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
  eventName: string;

  @property({
    type: 'string',
    required: true
  })
  eventDescription: string;

  @property({
    type: 'string',
    required: true
  })
  screenName: string;

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

  @belongsTo(() => User)
  userId: number;

  @belongsTo(() => Resume)
  resumeId: number;

  constructor(data?: Partial<EventHistory>) {
    super(data);
  }
}

export interface EventHistoryRelations {
  // describe navigational properties here
}

export type EventHistoryWithRelations = EventHistory & EventHistoryRelations;
