import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {FaqCategory, FaqCategoryRelations, Faq} from '../models';
import {FaqRepository} from './faq.repository';

export class FaqCategoryRepository extends TimeStampRepositoryMixin<
  FaqCategory,
  typeof FaqCategory.prototype.id,
  Constructor<
    DefaultCrudRepository<
      FaqCategory,
      typeof FaqCategory.prototype.id,
      FaqCategoryRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly faqs: HasManyRepositoryFactory<Faq, typeof FaqCategory.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('FaqRepository') protected faqRepositoryGetter: Getter<FaqRepository>,
  ) {
    super(FaqCategory, dataSource);
    this.faqs = this.createHasManyRepositoryFactoryFor('faqs', faqRepositoryGetter,);
    this.registerInclusionResolver('faqs', this.faqs.inclusionResolver);
  }
}
