import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Plan, PlanRelations, Courses} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {CoursesRepository} from './courses.repository';

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

  public readonly courses: BelongsToAccessor<Courses, typeof Plan.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('CoursesRepository') protected coursesRepositoryGetter: Getter<CoursesRepository>,
  ) {
    super(Plan, dataSource);
    this.courses = this.createBelongsToAccessorFor('courses', coursesRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
  }
}

