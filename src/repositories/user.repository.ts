import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {User, UserRelations, Resume, Subscription, Plan} from '../models';
import {ResumeRepository} from './resume.repository';
import {SubscriptionRepository} from './subscription.repository';
import {PlanRepository} from './plan.repository';

export type Credentials = {
  email?: string;
  password: string;
};
export class UserRepository extends TimeStampRepositoryMixin<
  User,
  typeof User.prototype.id,
  Constructor<
    DefaultCrudRepository<User, typeof User.prototype.id, UserRelations>
  >
>(DefaultCrudRepository) {

  public readonly resumes: HasManyRepositoryFactory<Resume, typeof User.prototype.id>;

  public readonly activeSubscription: BelongsToAccessor<Subscription, typeof User.prototype.id>;

  public readonly currentPlan: BelongsToAccessor<Plan, typeof User.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('ResumeRepository') protected resumeRepositoryGetter: Getter<ResumeRepository>, @repository.getter('SubscriptionRepository') protected subscriptionRepositoryGetter: Getter<SubscriptionRepository>, @repository.getter('PlanRepository') protected planRepositoryGetter: Getter<PlanRepository>,
  ) {
    super(User, dataSource);
    this.currentPlan = this.createBelongsToAccessorFor('currentPlan', planRepositoryGetter,);
    this.registerInclusionResolver('currentPlan', this.currentPlan.inclusionResolver);
    this.activeSubscription = this.createBelongsToAccessorFor('activeSubscription', subscriptionRepositoryGetter,);
    this.registerInclusionResolver('activeSubscription', this.activeSubscription.inclusionResolver);
    this.resumes = this.createHasManyRepositoryFactoryFor('resumes', resumeRepositoryGetter,);
    this.registerInclusionResolver('resumes', this.resumes.inclusionResolver);
  }
}
