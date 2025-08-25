import { Constructor, inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { JobPortalDataSource } from '../datasources';
import { SavedJobsUsersLink, SavedJobsUsersLinkRelations } from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class SavedJobsUsersLinkRepository extends TimeStampRepositoryMixin<
  SavedJobsUsersLink,
  typeof SavedJobsUsersLink.prototype.id,
  Constructor<
    DefaultCrudRepository<
      SavedJobsUsersLink,
      typeof SavedJobsUsersLink.prototype.id,
      SavedJobsUsersLinkRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(SavedJobsUsersLink, dataSource);
  }
}
