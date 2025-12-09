import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Resume, ResumeRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class ResumeRepository extends TimeStampRepositoryMixin<
  Resume,
  typeof Resume.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Resume,
      typeof Resume.prototype.id,
      ResumeRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly user: BelongsToAccessor<User, typeof Resume.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Resume, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
