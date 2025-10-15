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
import {PlansFaq} from '../models';
import {PlansFaqRepository} from '../repositories';

export class PlansFaqController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
    @repository(PlansFaqRepository)
    public plansFaqRepository: PlansFaqRepository,
  ) { }

  @post('/plans-faqs')
  @response(200, {
    description: 'PlansFaq model instance',
    content: {'application/json': {schema: getModelSchemaRef(PlansFaq)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlansFaq, {
            title: 'NewPlansFaq',
            exclude: ['id'],
          }),
        },
      },
    })
    plansFaq: Omit<PlansFaq, 'id'>,
  ): Promise<PlansFaq> {
    return this.plansFaqRepository.create(plansFaq);
  }

  @get('/plans-faqs/count')
  @response(200, {
    description: 'PlansFaq model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PlansFaq) where?: Where<PlansFaq>,
  ): Promise<Count> {
    return this.plansFaqRepository.count(where);
  }

  @get('/plans-faqs')
  @response(200, {
    description: 'Array of PlansFaq model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PlansFaq, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PlansFaq) filter?: Filter<PlansFaq>,
  ): Promise<PlansFaq[]> {
    return this.plansFaqRepository.find(filter);
  }

  @patch('/plans-faqs')
  @response(200, {
    description: 'PlansFaq PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlansFaq, {partial: true}),
        },
      },
    })
    plansFaq: PlansFaq,
    @param.where(PlansFaq) where?: Where<PlansFaq>,
  ): Promise<Count> {
    return this.plansFaqRepository.updateAll(plansFaq, where);
  }

  @get('/plans-faqs/{id}')
  @response(200, {
    description: 'PlansFaq model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PlansFaq, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PlansFaq, {exclude: 'where'}) filter?: FilterExcludingWhere<PlansFaq>
  ): Promise<PlansFaq> {
    return this.plansFaqRepository.findById(id, filter);
  }

  @patch('/plans-faqs/{id}')
  @response(204, {
    description: 'PlansFaq PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlansFaq, {partial: true}),
        },
      },
    })
    plansFaq: PlansFaq,
  ): Promise<void> {
    await this.plansFaqRepository.updateById(id, plansFaq);
  }

  @put('/plans-faqs/{id}')
  @response(204, {
    description: 'PlansFaq PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() plansFaq: PlansFaq,
  ): Promise<void> {
    await this.plansFaqRepository.replaceById(id, plansFaq);
  }

  @del('/plans-faqs/{id}')
  @response(204, {
    description: 'PlansFaq DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.plansFaqRepository.deleteById(id);
  }

  @post('/plans-faqs/create-all')
  async createAllKeyoutcomes(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(PlansFaq, {
              title: 'NewPlansFaq',
              exclude: ['id'],
            }),
          },
        },
      },
    })
    planFaq: Omit<PlansFaq, 'id'>[],
  ): Promise<{success: boolean; message: string;}> {
    try {
      await this.plansFaqRepository.createAll(planFaq);

      return {
        success: true,
        message: 'Faq created'
      };
    } catch (error) {
      throw error;
    }
  }


  @patch('/plans-faqs/update-all')
  @response(200, {
    description: ' PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateByArray(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(PlansFaq, {partial: true})
          },
        },
      },
    })
    planFaq: PlansFaq[],
  ): Promise<{success: boolean, message: string}> {
    const repo = new DefaultTransactionalRepository(PlansFaq, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      await this.plansFaqRepository.deleteAll({coursesId: planFaq[0].coursesId}, {transaction: tx});
      for (const plansfaq of planFaq) {
        await this.plansFaqRepository.create({...plansfaq, isDeleted: false}, {transaction: tx});

      }
      await tx.commit();
      return {
        success: true,
        message: 'Faq updated successfully'
      }
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
