import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  FaqCategory,
  Faq,
} from '../models';
import {FaqCategoryRepository} from '../repositories';

export class FaqCategoryFaqController {
  constructor(
    @repository(FaqCategoryRepository) protected faqCategoryRepository: FaqCategoryRepository,
  ) { }

  @get('/faq-categories/{id}/faqs', {
    responses: {
      '200': {
        description: 'Array of FaqCategory has many Faq',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Faq)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Faq>,
  ): Promise<Faq[]> {
    return this.faqCategoryRepository.faqs(id).find(filter);
  }

  @post('/faq-categories/{id}/faqs', {
    responses: {
      '200': {
        description: 'FaqCategory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Faq)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof FaqCategory.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faq, {
            title: 'NewFaqInFaqCategory',
            exclude: ['id'],
            optional: ['faqCategoryId']
          }),
        },
      },
    }) faq: Omit<Faq, 'id'>,
  ): Promise<Faq> {
    return this.faqCategoryRepository.faqs(id).create(faq);
  }

  @patch('/faq-categories/{id}/faqs', {
    responses: {
      '200': {
        description: 'FaqCategory.Faq PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faq, {partial: true}),
        },
      },
    })
    faq: Partial<Faq>,
    @param.query.object('where', getWhereSchemaFor(Faq)) where?: Where<Faq>,
  ): Promise<Count> {
    return this.faqCategoryRepository.faqs(id).patch(faq, where);
  }

  @del('/faq-categories/{id}/faqs', {
    responses: {
      '200': {
        description: 'FaqCategory.Faq DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Faq)) where?: Where<Faq>,
  ): Promise<Count> {
    return this.faqCategoryRepository.faqs(id).delete(where);
  }
}
