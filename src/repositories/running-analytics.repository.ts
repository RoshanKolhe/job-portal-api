import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {RunningAnalytics, RunningAnalyticsRelations, Resume} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {ResumeRepository} from './resume.repository';

export class RunningAnalyticsRepository extends TimeStampRepositoryMixin<
  RunningAnalytics,
  typeof RunningAnalytics.prototype.id,
  Constructor<
    DefaultCrudRepository<
      RunningAnalytics,
      typeof RunningAnalytics.prototype.id,
      RunningAnalyticsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly resume: BelongsToAccessor<Resume, typeof RunningAnalytics.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('ResumeRepository') protected resumeRepositoryGetter: Getter<ResumeRepository>,
  ) {
    super(RunningAnalytics, dataSource);
    this.resume = this.createBelongsToAccessorFor('resume', resumeRepositoryGetter,);
    this.registerInclusionResolver('resume', this.resume.inclusionResolver);
  }
}
