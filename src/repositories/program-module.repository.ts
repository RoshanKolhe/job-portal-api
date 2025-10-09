import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {ProgramModule, ProgramModuleRelations} from '../models';


export class ProgramModuleRepository extends TimeStampRepositoryMixin<
  ProgramModule,
  typeof ProgramModule.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ProgramModule,
      typeof ProgramModule.prototype.id,
      ProgramModuleRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(ProgramModule, dataSource);
  }
}
