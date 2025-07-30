import { Entity, hasMany, model, property, belongsTo } from '@loopback/repository';
import { Resume } from './resume.model';
import { Subscription } from './subscription.model';
import { Plan } from './plan.model';

@model()
export class User extends Entity {
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
  fullName: string;

  @property({
    type: 'string',
  })
  dob?: string;

  @property({
    type: 'string',
  })
  fullAddress?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  password: string;

  @property({
    type: 'string',
    // required: true,
  })
  phoneNumber?: string;

  @property({
    type: 'object',
  })
  avatar?: object;

  @property({
    type: 'object',
  })
  backgroundImage?: object;

  @property({
    type: 'string'
  })
  profileDescription?: string;

  @property({
    type: 'string'
  })
  designation?: string;

  @property.array(String, {
    name: 'permissions',
  })
  permissions: String[];

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @property({
    type: 'string',
  })
  otp?: string;

  @property({
    type: 'string',
  })
  fcmToken?: string;

  @property({
    type: 'string',
  })
  otpExpireAt?: string;

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
    default: false,
  })
  linkedinUrl?: string;

  @property({
    type: 'string',
    default: 'false',
  })
  provider: string;

  @property({
    type: 'string',
  })
  lmsToken?: string;

  @hasMany(() => Resume)
  resumes: Resume[];

  @belongsTo(() => Subscription)
  activeSubscriptionId: number;

  @belongsTo(() => Plan)
  currentPlanId: number;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
