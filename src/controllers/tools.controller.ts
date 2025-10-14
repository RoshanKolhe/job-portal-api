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
import {Tools} from '../models';
import {ToolsRepository} from '../repositories';

export class ToolsController {
  constructor(
    @repository(ToolsRepository)
    public toolsRepository: ToolsRepository,
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
  ) { }

  @post('/tools')
  @response(200, {
    description: 'Tools model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tools)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tools, {
            title: 'NewTools',
            exclude: ['id'],
          }),
        },
      },
    })
    tools: Omit<Tools, 'id'>,
  ): Promise<Tools> {
    return this.toolsRepository.create(tools);
  }

  @get('/tools/count')
  @response(200, {
    description: 'Tools model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Tools) where?: Where<Tools>,
  ): Promise<Count> {
    return this.toolsRepository.count(where);
  }

  @get('/tools')
  @response(200, {
    description: 'Array of Tools model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tools, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Tools) filter?: Filter<Tools>,
  ): Promise<Tools[]> {
    return this.toolsRepository.find(filter);
  }

  @patch('/tools')
  @response(200, {
    description: 'Tools PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tools, {partial: true}),
        },
      },
    })
    tools: Tools,
    @param.where(Tools) where?: Where<Tools>,
  ): Promise<Count> {
    return this.toolsRepository.updateAll(tools, where);
  }

  @get('/tools/{id}')
  @response(200, {
    description: 'Tools model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tools, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Tools, {exclude: 'where'}) filter?: FilterExcludingWhere<Tools>
  ): Promise<Tools> {
    return this.toolsRepository.findById(id, filter);
  }

  @patch('/tools/{id}')
  @response(204, {
    description: 'Tools PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tools, {partial: true}),
        },
      },
    })
    tools: Tools,
  ): Promise<void> {
    await this.toolsRepository.updateById(id, tools);
  }

  @put('/tools/{id}')
  @response(204, {
    description: 'Tools PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() tools: Tools,
  ): Promise<void> {
    await this.toolsRepository.replaceById(id, tools);
  }

  @del('/tools/{id}')
  @response(204, {
    description: 'Tools DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.toolsRepository.deleteById(id);
  }


  @post('/tools/create-all')
  async createAllKeyoutcomes(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Tools, {
              title: 'NewTools',
              exclude: ['id'],
            }),
          },
        },
      },
    })
    tools: Omit<Tools, 'id'>[],
  ): Promise<{success: boolean; message: string;}> {
    try {
      await this.toolsRepository.createAll(tools);

      return {
        success: true,
        message: 'Tools created'
      };
    } catch (error) {
      throw error;
    }
  }

  @patch('/tools/update-all')
  @response(200, {
    description: 'Tools PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateByArray(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Tools, {partial: true})
          },
        },
      },
    })
    tools: Tools[],
  ): Promise<{success: boolean, message: string}> {
    const repo = new DefaultTransactionalRepository(Tools, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      await this.toolsRepository.deleteAll({coursesId: tools[0].coursesId}, {transaction: tx});
      for (const tool of tools) {
        console.log("Tools", tool);
        await this.toolsRepository.create({...tool, isDeleted: false}, {transaction: tx});
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
