import {Constructor, inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {CurrencyExchangeRate, CurrencyExchangeRateRelations} from '../models';
import { TimeStampRepositoryMixin } from '../mixins/timestamp-repository-mixin';

export class CurrencyExchangeRateRepository extends TimeStampRepositoryMixin<
  CurrencyExchangeRate,
  typeof CurrencyExchangeRate.prototype.id,
  Constructor<
    DefaultCrudRepository<
      CurrencyExchangeRate,
      typeof CurrencyExchangeRate.prototype.id,
      CurrencyExchangeRateRelations
    >
  >
>(DefaultCrudRepository) {
  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource,
  ) {
    super(CurrencyExchangeRate, dataSource);
  }
}
