import {Entity, model, property} from '@loopback/repository';

@model()
export class Jobs extends Entity {
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
  jobTitle: string;

  @property({
    type: 'string',
    required: true
  })
  company: string;

  // @property({
  //   type: 'string',
  //   required: true
  // })
  // companyLogo: string;

  @property({
    type: 'string',
  })
  location: string;

  @property({
    type: 'string',
    required: true
  })
  salaryRange: string;

  @property({
    type: 'string',
    required: true
  })
  jobType: string;  // full time or part time

  @property({
    type: 'array',
    itemType: 'string'
  })
  skillRequirements: string[];

  @property({
    type: 'array',
    itemType: 'string'
  })
  benifits: string[];

  @property({
    type: 'string'
  })
  description: string;

  @property({
    type: 'string',
    required: true
  })
  redirectUrl: string;

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
  constructor(data?: Partial<Jobs>) {
    super(data);
  }
}

export interface JobsRelations {
}

export type JobsWithRelations = Jobs & JobsRelations;
