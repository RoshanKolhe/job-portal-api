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
import {ProgramModule} from '../models';
import {ProgramModuleRepository} from '../repositories';

export class ProgramModuleController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
    @repository(ProgramModuleRepository)
    public programModuleRepository: ProgramModuleRepository,
  ) { }

  @post('/program-modules')
  @response(200, {
    description: 'ProgramModule model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProgramModule)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramModule, {
            title: 'NewProgramModule',
            exclude: ['id'],
          }),
        },
      },
    })
    programModule: Omit<ProgramModule, 'id'>,
  ): Promise<ProgramModule> {
    return this.programModuleRepository.create(programModule);
  }

  @get('/program-modules/count')
  @response(200, {
    description: 'ProgramModule model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProgramModule) where?: Where<ProgramModule>,
  ): Promise<Count> {
    return this.programModuleRepository.count(where);
  }

  @get('/program-modules')
  @response(200, {
    description: 'Array of ProgramModule model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProgramModule, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProgramModule) filter?: Filter<ProgramModule>,
  ): Promise<ProgramModule[]> {
    return this.programModuleRepository.find(filter);
  }

  @patch('/program-modules')
  @response(200, {
    description: 'ProgramModule PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramModule, {partial: true}),
        },
      },
    })
    programModule: ProgramModule,
    @param.where(ProgramModule) where?: Where<ProgramModule>,
  ): Promise<Count> {
    return this.programModuleRepository.updateAll(programModule, where);
  }

  @get('/program-modules/{id}')
  @response(200, {
    description: 'ProgramModule model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProgramModule, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProgramModule, {exclude: 'where'}) filter?: FilterExcludingWhere<ProgramModule>
  ): Promise<ProgramModule> {
    return this.programModuleRepository.findById(id, filter);
  }

  @patch('/program-modules/{id}')
  @response(204, {
    description: 'ProgramModule PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramModule, {partial: true}),
        },
      },
    })
    programModule: ProgramModule,
  ): Promise<void> {
    await this.programModuleRepository.updateById(id, programModule);
  }

  @put('/program-modules/{id}')
  @response(204, {
    description: 'ProgramModule PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() programModule: ProgramModule,
  ): Promise<void> {
    await this.programModuleRepository.replaceById(id, programModule);
  }

  @del('/program-modules/{id}')
  @response(204, {
    description: 'ProgramModule DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.programModuleRepository.deleteById(id);
  }


  @post('/program-modules/create-all')
  async createAllKeyoutcomes(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(ProgramModule, {
              title: 'NewProgramModule',
              exclude: ['id'],
            }),
          },
        },
      },
    })
    programModule: Omit<ProgramModule, 'id'>[],
  ): Promise<{success: boolean; message: string;}> {
    try {
      await this.programModuleRepository.createAll(programModule);

      return {
        success: true,
        message: 'Program modules created'
      };
    } catch (error) {
      throw error;
    }
  }




  @patch('/program-modules/update-all')
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
            items: getModelSchemaRef(ProgramModule, {partial: true})
          },
        },
      },
    })
    programModules: ProgramModule[],
  ): Promise<{success: boolean, message: string}> {
    const repo = new DefaultTransactionalRepository(ProgramModule, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      for (const programModule of programModules) {
        if (programModule.id) {
          await this.programModuleRepository.updateById(programModule.id, {...programModule}, {transaction: tx});
        } else {
          await this.programModuleRepository.create({...programModule, isDeleted: false}, {transaction: tx});
        }
      }
      await tx.commit();
      return {
        success: true,
        message: 'ProgramModule updated successfully'
      }
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

}
