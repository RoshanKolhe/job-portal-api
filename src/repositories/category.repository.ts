import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Category, CategoryRelations} from '../models';

export class CategoryRepository extends TimeStampRepositoryMixin<
  Category,
  typeof Category.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Category,
      typeof Category.prototype.id,
      CategoryRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Category, dataSource);
  }
}
