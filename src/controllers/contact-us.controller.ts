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
import {ContactUs} from '../models';
import {ContactUsRepository} from '../repositories';

export class ContactUsController {
  constructor(
    @repository(ContactUsRepository)
    public contactUsRepository : ContactUsRepository,
  ) {}

  @post('/contact-uses')
  @response(200, {
    description: 'ContactUs model instance',
    content: {'application/json': {schema: getModelSchemaRef(ContactUs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContactUs, {
            title: 'NewContactUs',
            exclude: ['id'],
          }),
        },
      },
    })
    contactUs: Omit<ContactUs, 'id'>,
  ): Promise<ContactUs> {
    return this.contactUsRepository.create(contactUs);
  }

  @get('/contact-uses/count')
  @response(200, {
    description: 'ContactUs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ContactUs) where?: Where<ContactUs>,
  ): Promise<Count> {
    return this.contactUsRepository.count(where);
  }

  @get('/contact-uses')
  @response(200, {
    description: 'Array of ContactUs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ContactUs, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ContactUs) filter?: Filter<ContactUs>,
  ): Promise<ContactUs[]> {
    return this.contactUsRepository.find(filter);
  }

  @patch('/contact-uses')
  @response(200, {
    description: 'ContactUs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContactUs, {partial: true}),
        },
      },
    })
    contactUs: ContactUs,
    @param.where(ContactUs) where?: Where<ContactUs>,
  ): Promise<Count> {
    return this.contactUsRepository.updateAll(contactUs, where);
  }

  @get('/contact-uses/{id}')
  @response(200, {
    description: 'ContactUs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ContactUs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ContactUs, {exclude: 'where'}) filter?: FilterExcludingWhere<ContactUs>
  ): Promise<ContactUs> {
    return this.contactUsRepository.findById(id, filter);
  }

  @patch('/contact-uses/{id}')
  @response(204, {
    description: 'ContactUs PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ContactUs, {partial: true}),
        },
      },
    })
    contactUs: ContactUs,
  ): Promise<void> {
    await this.contactUsRepository.updateById(id, contactUs);
  }

  @put('/contact-uses/{id}')
  @response(204, {
    description: 'ContactUs PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() contactUs: ContactUs,
  ): Promise<void> {
    await this.contactUsRepository.replaceById(id, contactUs);
  }

  @del('/contact-uses/{id}')
  @response(204, {
    description: 'ContactUs DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.contactUsRepository.deleteById(id);
  }
}
