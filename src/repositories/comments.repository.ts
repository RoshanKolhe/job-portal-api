import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Comments, CommentsRelations, Blogs, User} from '../models';
import {BlogsRepository} from './blogs.repository';
import {UserRepository} from './user.repository';

export class CommentsRepository extends TimeStampRepositoryMixin<
  Comments,
  typeof Comments.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Comments,
      typeof Comments.prototype.id,
      CommentsRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly blogs: BelongsToAccessor<Blogs, typeof Comments.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Comments.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('BlogsRepository') protected blogsRepositoryGetter: Getter<BlogsRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Comments, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.blogs = this.createBelongsToAccessorFor('blogs', blogsRepositoryGetter,);
    this.registerInclusionResolver('blogs', this.blogs.inclusionResolver);
  }
}
