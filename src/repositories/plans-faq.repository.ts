import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {PlansFaq, PlansFaqRelations, Courses} from '../models';
import {CoursesRepository} from './courses.repository';

export class PlansFaqRepository extends TimeStampRepositoryMixin<
  PlansFaq,
  typeof PlansFaq.prototype.id,
  Constructor<
    DefaultCrudRepository<
      PlansFaq,
      typeof PlansFaq.prototype.id,
      PlansFaqRelations
    >
  >
>(DefaultCrudRepository) {

 

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(PlansFaq, dataSource);

  }
}
