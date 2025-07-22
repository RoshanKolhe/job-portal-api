import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Courses, CoursesRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class CoursesRepository extends TimeStampRepositoryMixin<
  Courses,
  typeof Courses.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Courses,
      typeof Courses.prototype.id,
      CoursesRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Courses, dataSource);
  }
}
