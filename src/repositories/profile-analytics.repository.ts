import {inject, Getter, Constructor} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {ProfileAnalytics, ProfileAnalyticsRelations, User, Resume} from '../models';
import {UserRepository} from './user.repository';
import {ResumeRepository} from './resume.repository';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class ProfileAnalyticsRepository extends TimeStampRepositoryMixin<
  ProfileAnalytics,
  typeof ProfileAnalytics.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProfileAnalytics,
      typeof ProfileAnalytics.prototype.id,
      ProfileAnalyticsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly resume: BelongsToAccessor<Resume, typeof ProfileAnalytics.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof ProfileAnalytics.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('ResumeRepository') protected resumeRepositoryGetter: Getter<ResumeRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(ProfileAnalytics, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.resume = this.createBelongsToAccessorFor('resume', resumeRepositoryGetter,);
    this.registerInclusionResolver('resume', this.resume.inclusionResolver);
  }
}

