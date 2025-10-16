import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Plan, PlanRelations, Courses, Services} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {CoursesRepository} from './courses.repository';
import {ServicesRepository} from './services.repository';

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

  public readonly services: BelongsToAccessor<Services, typeof Plan.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('CoursesRepository') protected coursesRepositoryGetter: Getter<CoursesRepository>, @repository.getter('ServicesRepository') protected servicesRepositoryGetter: Getter<ServicesRepository>,
  ) {
    super(Plan, dataSource);
    this.services = this.createBelongsToAccessorFor('services', servicesRepositoryGetter,);
    this.registerInclusionResolver('services', this.services.inclusionResolver);

    this.courses = this.createBelongsToAccessorFor('courses', coursesRepositoryGetter,);
    this.registerInclusionResolver('courses', this.courses.inclusionResolver);
  }
}

