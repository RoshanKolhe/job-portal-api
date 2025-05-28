import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {Resume, ResumeRelations} from '../models';


export class ResumeRepository extends TimeStampRepositoryMixin<
  Resume,
  typeof Resume.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Resume,
      typeof Resume.prototype.id,
      ResumeRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(Resume, dataSource);
  }
}
