import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {User, UserRelations, Resume} from '../models';
import {ResumeRepository} from './resume.repository';

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

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('ResumeRepository') protected resumeRepositoryGetter: Getter<ResumeRepository>,
  ) {
    super(User, dataSource);
    this.resumes = this.createHasManyRepositoryFactoryFor('resumes', resumeRepositoryGetter,);
    this.registerInclusionResolver('resumes', this.resumes.inclusionResolver);
  }
}
