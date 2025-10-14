import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Faq,
  FaqCategory,
} from '../models';
import {FaqRepository} from '../repositories';

export class FaqFaqCategoryController {
  constructor(
    @repository(FaqRepository)
    public faqRepository: FaqRepository,
  ) { }

  @get('/faqs/{id}/faq-category', {
    responses: {
      '200': {
        description: 'FaqCategory belonging to Faq',
        content: {
          'application/json': {
            schema: getModelSchemaRef(FaqCategory),
          },
        },
      },
    },
  })
  async getFaqCategory(
    @param.path.number('id') id: typeof Faq.prototype.id,
  ): Promise<FaqCategory> {
    return this.faqRepository.faqCategory(id);
  }
}
