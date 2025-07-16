import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Jobs, JobsRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class JobsRepository extends TimeStampRepositoryMixin<
  Jobs,
  typeof Jobs.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Jobs,
      typeof Jobs.prototype.id,
      JobsRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Jobs, dataSource);
  }
}
