import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Faq} from '../models';
import {FaqRepository} from '../repositories';

export class FaqController {
  constructor(
    @repository(FaqRepository)
    public faqRepository: FaqRepository,
  ) { }

  @post('/faqs')
  @response(200, {
    description: 'Faq model instance',
    content: {'application/json': {schema: getModelSchemaRef(Faq)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faq, {
            title: 'NewFaq',
            exclude: ['id'],
          }),
        },
      },
    })
    faq: Omit<Faq, 'id'>,
  ): Promise<Faq> {
    return this.faqRepository.create(faq);
  }

  @get('/faqs/count')
  @response(200, {
    description: 'Faq model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Faq) where?: Where<Faq>,
  ): Promise<Count> {
    return this.faqRepository.count(where);
  }

  @get('/faqs')
  @response(200, {
    description: 'Array of Faq model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Faq, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Faq) filter?: Filter<Faq>,
  ): Promise<Faq[]> {
    return this.faqRepository.find({
      ...filter,
      include: [
        ...(filter?.include ?? []),
        {
          relation: 'faqCategory',
        }
      ]
    });
  }

  @patch('/faqs')
  @response(200, {
    description: 'Faq PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faq, {partial: true}),
        },
      },
    })
    faq: Faq,
    @param.where(Faq) where?: Where<Faq>,
  ): Promise<Count> {
    return this.faqRepository.updateAll(faq, where);
  }

  @get('/faqs/{id}')
  @response(200, {
    description: 'Faq model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Faq, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Faq, {exclude: 'where'}) filter?: FilterExcludingWhere<Faq>
  ): Promise<Faq> {
    return this.faqRepository.findById(id, {
      ...filter,
      include: [
        ...(filter?.include ?? []),
        {
          relation: 'faqCategory',
        }
      ]
    });
  }

  @patch('/faqs/{id}')
  @response(204, {
    description: 'Faq PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Faq, {partial: true}),
        },
      },
    })
    faq: Faq,
  ): Promise<void> {
    await this.faqRepository.updateById(id, faq);
  }

  @put('/faqs/{id}')
  @response(204, {
    description: 'Faq PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() faq: Faq,
  ): Promise<void> {
    await this.faqRepository.replaceById(id, faq);
  }

  @del('/faqs/{id}')
  @response(204, {
    description: 'Faq DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.faqRepository.deleteById(id);
  }
}
