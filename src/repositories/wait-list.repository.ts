import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {WaitList, WaitListRelations} from '../models';

export class WaitListRepository extends TimeStampRepositoryMixin<
  WaitList,
  typeof WaitList.prototype.id,
  Constructor<
    DefaultCrudRepository<
      WaitList,
      typeof WaitList.prototype.id,
      WaitListRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(WaitList, dataSource);
  }
}
