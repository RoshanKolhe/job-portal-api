import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  DefaultTransactionalRepository,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
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
import {JobPortalDataSource} from '../datasources';
import {KeyOutComes} from '../models';
import {KeyOutComesRepository} from '../repositories';

export class KeyOutComesController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
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


  @post('/keyoutcomes/create-all')
  async createAllKeyoutcomes(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(KeyOutComes, {
              title: 'NewKeyOutComes',
              exclude: ['id'],
            }),
          },
        },
      },
    })
    keyOutComes: Omit<KeyOutComes, 'id'>[],
  ): Promise<{success: boolean; message: string;}> {
    try {
      await this.keyOutComesRepository.createAll(keyOutComes);

      return {
        success: true,
        message: 'Key outcomes created'
      };
    } catch (error) {
      throw error;
    }
  }

  @patch('/keyoutcomes/update-all')
  @response(200, {
    description: 'KeyOutComes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateByArray(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(KeyOutComes, {partial: true})
          },
        },
      },
    })
    keyOutComes: KeyOutComes[],
  ): Promise<{success: boolean, message: string}> {
    const repo = new DefaultTransactionalRepository(KeyOutComes, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      for (const keyOutCome of keyOutComes) {
        if (keyOutCome.id) {
          await this.keyOutComesRepository.updateById(keyOutCome.id, {...keyOutCome}, {transaction: tx});
        } else {
          await this.keyOutComesRepository.create({...keyOutCome, isDeleted: false}, {transaction: tx});
        }
      }

      await tx.commit();
      return {
        success: true,
        message: 'Keyoutcomes updated successfully'
      }
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

}


