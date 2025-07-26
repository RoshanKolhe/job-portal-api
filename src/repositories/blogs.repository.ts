import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Blogs, BlogsRelations} from '../models';


export class BlogsRepository extends TimeStampRepositoryMixin<
  Blogs,
  typeof Blogs.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Blogs,
      typeof Blogs.prototype.id,
      BlogsRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Blogs, dataSource);
  }
}

