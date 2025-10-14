import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Tools, ToolsRelations} from '../models';

export class ToolsRepository extends TimeStampRepositoryMixin<
  Tools,
  typeof Tools.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Tools,
      typeof Tools.prototype.id,
      ToolsRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Tools, dataSource);
  }
}
