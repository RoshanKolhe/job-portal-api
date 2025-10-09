import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {KeyOutComes, KeyOutComesRelations} from '../models';

export class KeyOutComesRepository extends TimeStampRepositoryMixin<
  KeyOutComes,
  typeof KeyOutComes.prototype.id,
  Constructor<
    DefaultCrudRepository<
      KeyOutComes,
      typeof KeyOutComes.prototype.id,
      KeyOutComesRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(KeyOutComes, dataSource);
  }
}
