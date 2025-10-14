import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {FaqCategory} from '../models';
import {FaqCategoryRepository} from '../repositories';

export class FaqCategoryController {
  constructor(
    @repository(FaqCategoryRepository)
    public faqCategoryRepository : FaqCategoryRepository,
  ) {}

  @post('/faq-categories')
  @response(200, {
    description: 'FaqCategory model instance',
    content: {'application/json': {schema: getModelSchemaRef(FaqCategory)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FaqCategory, {
            title: 'NewFaqCategory',
            exclude: ['id'],
          }),
        },
      },
    })
    faqCategory: Omit<FaqCategory, 'id'>,
  ): Promise<FaqCategory> {
    return this.faqCategoryRepository.create(faqCategory);
  }

  @get('/faq-categories/count')
  @response(200, {
    description: 'FaqCategory model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(FaqCategory) where?: Where<FaqCategory>,
  ): Promise<Count> {
    return this.faqCategoryRepository.count(where);
  }

  @get('/faq-categories')
  @response(200, {
    description: 'Array of FaqCategory model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(FaqCategory, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(FaqCategory) filter?: Filter<FaqCategory>,
  ): Promise<FaqCategory[]> {
    return this.faqCategoryRepository.find(filter);
  }

  @patch('/faq-categories')
  @response(200, {
    description: 'FaqCategory PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FaqCategory, {partial: true}),
        },
      },
    })
    faqCategory: FaqCategory,
    @param.where(FaqCategory) where?: Where<FaqCategory>,
  ): Promise<Count> {
    return this.faqCategoryRepository.updateAll(faqCategory, where);
  }

  @get('/faq-categories/{id}')
  @response(200, {
    description: 'FaqCategory model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(FaqCategory, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(FaqCategory, {exclude: 'where'}) filter?: FilterExcludingWhere<FaqCategory>
  ): Promise<FaqCategory> {
    return this.faqCategoryRepository.findById(id, filter);
  }

  @patch('/faq-categories/{id}')
  @response(204, {
    description: 'FaqCategory PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(FaqCategory, {partial: true}),
        },
      },
    })
    faqCategory: FaqCategory,
  ): Promise<void> {
    await this.faqCategoryRepository.updateById(id, faqCategory);
  }

  @put('/faq-categories/{id}')
  @response(204, {
    description: 'FaqCategory PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() faqCategory: FaqCategory,
  ): Promise<void> {
    await this.faqCategoryRepository.replaceById(id, faqCategory);
  }

  @del('/faq-categories/{id}')
  @response(204, {
    description: 'FaqCategory DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.faqCategoryRepository.deleteById(id);
  }
}
