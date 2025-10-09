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
import {Batches} from '../models';
import {BatchesRepository} from '../repositories';

export class BatchesController {
  constructor(
    @repository(BatchesRepository)
    public batchesRepository: BatchesRepository,
  ) { }

  @post('/batches')
  @response(200, {
    description: 'Batches model instance',
    content: {'application/json': {schema: getModelSchemaRef(Batches)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Batches, {
            title: 'NewBatches',
            exclude: ['id'],
          }),
        },
      },
    })
    batches: Omit<Batches, 'id'>,
  ): Promise<Batches> {
    return this.batchesRepository.create(batches);
  }

  @get('/batches/count')
  @response(200, {
    description: 'Batches model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Batches) where?: Where<Batches>,
  ): Promise<Count> {
    return this.batchesRepository.count(where);
  }

  @get('/batches')
  @response(200, {
    description: 'Array of Batches model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Batches, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Batches) filter?: Filter<Batches>,
  ): Promise<Batches[]> {
    return this.batchesRepository.find(
      {
        ...filter,
        include: [
          ...(filter?.include ?? []),
          {
            relation: 'plan',
            scope: {
              include: [
                {relation: 'courses'}
              ]
            }
          }
        ]
      }
    );
  }

  @patch('/batches')
  @response(200, {
    description: 'Batches PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Batches, {partial: true}),
        },
      },
    })
    batches: Batches,
    @param.where(Batches) where?: Where<Batches>,
  ): Promise<Count> {
    return this.batchesRepository.updateAll(batches, where);
  }

  @get('/batches/{id}')
  @response(200, {
    description: 'Batches model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Batches, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Batches, {exclude: 'where'}) filter?: FilterExcludingWhere<Batches>
  ): Promise<Batches> {
    return this.batchesRepository.findById(id, {
      ...filter,
      include: [
        ...(filter?.include ?? []),
        {
          relation: 'plan',
          scope: {
            include: [
              {relation: 'courses'}
            ]
          }
        }
      ]
    });
  }

  @patch('/batches/{id}')
  @response(204, {
    description: 'Batches PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Batches, {partial: true}),
        },
      },
    })
    batches: Batches,
  ): Promise<void> {
    await this.batchesRepository.updateById(id, batches);
  }

  @put('/batches/{id}')
  @response(204, {
    description: 'Batches PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() batches: Batches,
  ): Promise<void> {
    await this.batchesRepository.replaceById(id, batches);
  }

  @del('/batches/{id}')
  @response(204, {
    description: 'Batches DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.batchesRepository.deleteById(id);
  }
}
