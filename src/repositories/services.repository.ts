import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Services, ServicesRelations} from '../models';

export class ServicesRepository extends TimeStampRepositoryMixin<
  Services,
  typeof Services.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Services,
      typeof Services.prototype.id,
      ServicesRelations
    >
  >
>(DefaultCrudRepository) {

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Services, dataSource);

  }
}
