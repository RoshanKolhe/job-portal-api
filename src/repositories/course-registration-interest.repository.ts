import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {CourseRegistrationInterest, CourseRegistrationInterestRelations, Plan} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {PlanRepository} from './plan.repository';

export class CourseRegistrationInterestRepository extends TimeStampRepositoryMixin<
  CourseRegistrationInterest,
  typeof CourseRegistrationInterest.prototype.id,
  Constructor<
    DefaultCrudRepository<
      CourseRegistrationInterest,
      typeof CourseRegistrationInterest.prototype.id,
      CourseRegistrationInterestRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly plan: BelongsToAccessor<Plan, typeof CourseRegistrationInterest.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('PlanRepository') protected planRepositoryGetter: Getter<PlanRepository>,
  ) {
    super(CourseRegistrationInterest, dataSource);
    this.plan = this.createBelongsToAccessorFor('plan', planRepositoryGetter,);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
