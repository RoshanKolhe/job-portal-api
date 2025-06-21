import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Subscription, SubscriptionRelations, Plan, User} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {PlanRepository} from './plan.repository';
import {UserRepository} from './user.repository';

export class SubscriptionRepository extends TimeStampRepositoryMixin<
  Subscription,
  typeof Subscription.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Subscription,
      typeof Subscription.prototype.id,
      SubscriptionRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly plan: BelongsToAccessor<Plan, typeof Subscription.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Subscription.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('PlanRepository') protected planRepositoryGetter: Getter<PlanRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Subscription, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.plan = this.createBelongsToAccessorFor('plan', planRepositoryGetter,);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
