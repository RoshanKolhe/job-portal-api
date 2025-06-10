import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {ContactUs, ContactUsRelations} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';

export class ContactUsRepository extends TimeStampRepositoryMixin<
  ContactUs,
  typeof ContactUs.prototype.id,
  Constructor<
    DefaultCrudRepository<
      ContactUs,
      typeof ContactUs.prototype.id,
      ContactUsRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(ContactUs, dataSource);
  }
}
