import {Constructor, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Courses, KeyOutComes, KeyOutComesRelations} from '../models';

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

  public readonly courses: BelongsToAccessor<Courses, typeof KeyOutComes.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(KeyOutComes, dataSource);
  }
}
