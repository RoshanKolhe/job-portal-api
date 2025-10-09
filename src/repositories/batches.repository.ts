import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Batches, BatchesRelations, Plan} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {PlanRepository} from './plan.repository';

export class BatchesRepository extends TimeStampRepositoryMixin<
  Batches,
  typeof Batches.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Batches,
      typeof Batches.prototype.id,
      BatchesRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly plan: BelongsToAccessor<Plan, typeof Batches.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('PlanRepository') protected planRepositoryGetter: Getter<PlanRepository>,
  ) {
    super(Batches, dataSource);
    this.plan = this.createBelongsToAccessorFor('plan', planRepositoryGetter,);
    this.registerInclusionResolver('plan', this.plan.inclusionResolver);
  }
}
