import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {ProfileAnalytics, ProfileAnalyticsRelations, User, Resume} from '../models';
import {UserRepository} from './user.repository';
import {ResumeRepository} from './resume.repository';

export class ProfileAnalyticsRepository extends DefaultCrudRepository<
  ProfileAnalytics,
  typeof ProfileAnalytics.prototype.id,
  ProfileAnalyticsRelations
> {

  public readonly user: BelongsToAccessor<User, typeof ProfileAnalytics.prototype.id>;

  public readonly resume: BelongsToAccessor<Resume, typeof ProfileAnalytics.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ResumeRepository') protected resumeRepositoryGetter: Getter<ResumeRepository>,
  ) {
    super(ProfileAnalytics, dataSource);
    this.resume = this.createBelongsToAccessorFor('resume', resumeRepositoryGetter,);
    this.registerInclusionResolver('resume', this.resume.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
