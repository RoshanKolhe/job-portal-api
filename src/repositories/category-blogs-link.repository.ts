import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {CategoryBlogsLink, CategoryBlogsLinkRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';


export class CategoryBlogsLinkRepository extends TimeStampRepositoryMixin<
  CategoryBlogsLink,
  typeof CategoryBlogsLink.prototype.id,
  Constructor<
    DefaultCrudRepository<
      CategoryBlogsLink,
      typeof CategoryBlogsLink.prototype.id,
      CategoryBlogsLinkRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(CategoryBlogsLink, dataSource);
  }
}
