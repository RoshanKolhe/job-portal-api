import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Plan, PlanRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class PlanRepository extends TimeStampRepositoryMixin<
  Plan,
  typeof Plan.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Plan,
      typeof Plan.prototype.id,
      PlanRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Plan, dataSource);
  }
}

