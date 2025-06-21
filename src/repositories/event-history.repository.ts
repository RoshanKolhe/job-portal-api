import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {EventHistory, EventHistoryRelations, User, Resume} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';
import {UserRepository} from './user.repository';
import {ResumeRepository} from './resume.repository';

export class EventHistoryRepository extends TimeStampRepositoryMixin<
  EventHistory,
  typeof EventHistory.prototype.id,
  Constructor<
    DefaultCrudRepository<
      EventHistory,
      typeof EventHistory.prototype.id,
      EventHistoryRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly user: BelongsToAccessor<User, typeof EventHistory.prototype.id>;

  public readonly resume: BelongsToAccessor<Resume, typeof EventHistory.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ResumeRepository') protected resumeRepositoryGetter: Getter<ResumeRepository>,
  ) {
    super(EventHistory, dataSource);
    this.resume = this.createBelongsToAccessorFor('resume', resumeRepositoryGetter,);
    this.registerInclusionResolver('resume', this.resume.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
