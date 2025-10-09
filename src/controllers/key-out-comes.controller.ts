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
import {KeyOutComes} from '../models';
import {KeyOutComesRepository} from '../repositories';

export class KeyOutComesController {
  constructor(
    @repository(KeyOutComesRepository)
    public keyOutComesRepository: KeyOutComesRepository,
  ) { }

  @post('/keyoutcomes')
  @response(200, {
    description: 'KeyOutComes model instance',
    content: {'application/json': {schema: getModelSchemaRef(KeyOutComes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KeyOutComes, {
            title: 'NewKeyOutComes',
            exclude: ['id'],
          }),
        },
      },
    })
    keyOutComes: Omit<KeyOutComes, 'id'>,
  ): Promise<KeyOutComes> {
    return this.keyOutComesRepository.create(keyOutComes);
  }

  @get('/keyoutcomes/count')
  @response(200, {
    description: 'KeyOutComes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(KeyOutComes) where?: Where<KeyOutComes>,
  ): Promise<Count> {
    return this.keyOutComesRepository.count(where);
  }

  @get('/keyoutcomes')
  @response(200, {
    description: 'Array of KeyOutComes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(KeyOutComes, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(KeyOutComes) filter?: Filter<KeyOutComes>,
  ): Promise<KeyOutComes[]> {
    return this.keyOutComesRepository.find(filter);
  }

  @patch('/keyoutcomes')
  @response(200, {
    description: 'KeyOutComes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KeyOutComes, {partial: true}),
        },
      },
    })
    keyOutComes: KeyOutComes,
    @param.where(KeyOutComes) where?: Where<KeyOutComes>,
  ): Promise<Count> {
    return this.keyOutComesRepository.updateAll(keyOutComes, where);
  }

  @get('/keyoutcomes/{id}')
  @response(200, {
    description: 'KeyOutComes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(KeyOutComes, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(KeyOutComes, {exclude: 'where'}) filter?: FilterExcludingWhere<KeyOutComes>
  ): Promise<KeyOutComes> {
    return this.keyOutComesRepository.findById(id, filter);
  }

  @patch('/keyoutcomes/{id}')
  @response(204, {
    description: 'KeyOutComes PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KeyOutComes, {partial: true}),
        },
      },
    })
    keyOutComes: KeyOutComes,
  ): Promise<void> {
    await this.keyOutComesRepository.updateById(id, keyOutComes);
  }

  @put('/keyoutcomes/{id}')
  @response(204, {
    description: 'KeyOutComes PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() keyOutComes: KeyOutComes,
  ): Promise<void> {
    await this.keyOutComesRepository.replaceById(id, keyOutComes);
  }

  @del('/keyoutcomes/{id}')
  @response(204, {
    description: 'KeyOutComes DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.keyOutComesRepository.deleteById(id);
  }
}
