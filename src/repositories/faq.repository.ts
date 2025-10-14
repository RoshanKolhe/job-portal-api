import {Constructor, inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {JobPortalDataSource} from '../datasources';
import {Faq, FaqRelations, FaqCategory} from '../models';
import {TimeStampRepositoryMixin} from '../mixins/timestamp-repository-mixin';
import {FaqCategoryRepository} from './faq-category.repository';

export class FaqRepository extends TimeStampRepositoryMixin<
  Faq,
  typeof Faq.prototype.id,
  Constructor<
    DefaultCrudRepository<
      Faq,
      typeof Faq.prototype.id,
      FaqRelations
    >
  >
>(DefaultCrudRepository) {

  public readonly faqCategory: BelongsToAccessor<FaqCategory, typeof Faq.prototype.id>;

  constructor(
    @inject('datasources.job_portal') dataSource: JobPortalDataSource, @repository.getter('FaqCategoryRepository') protected faqCategoryRepositoryGetter: Getter<FaqCategoryRepository>,
  ) {
    super(Faq, dataSource);
    this.faqCategory = this.createBelongsToAccessorFor('faqCategory', faqCategoryRepositoryGetter,);
    this.registerInclusionResolver('faqCategory', this.faqCategory.inclusionResolver);
  }
}
