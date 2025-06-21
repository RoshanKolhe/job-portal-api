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
import { Plan } from '../models';
import { PlanRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class PlanController {
  constructor(
    @repository(PlanRepository)
    public planRepository: PlanRepository,
  ) { }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN
      ]
    }
  })
  @post('/plans')
  @response(200, {
    description: 'Plan model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Plan) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plan, {
            title: 'NewPlan',
            exclude: ['id'],
          }),
        },
      },
    })
    plan: Omit<Plan, 'id'>,
  ): Promise<Plan> {
    return this.planRepository.create(plan);
  }

  @get('/plans/count')
  @response(200, {
    description: 'Plan model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Plan) where?: Where<Plan>,
  ): Promise<Count> {
    return this.planRepository.count(where);
  }

  @get('/plans')
  @response(200, {
    description: 'Array of Plan model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Plan, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Plan) filter?: Filter<Plan>,
  ): Promise<Plan[]> {
    return this.planRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN
      ]
    }
  })
  @patch('/plans')
  @response(200, {
    description: 'Plan PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plan, { partial: true }),
        },
      },
    })
    plan: Plan,
    @param.where(Plan) where?: Where<Plan>,
  ): Promise<Count> {
    return this.planRepository.updateAll(plan, where);
  }

  @get('/plans/{id}')
  @response(200, {
    description: 'Plan model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Plan, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Plan, { exclude: 'where' }) filter?: FilterExcludingWhere<Plan>
  ): Promise<Plan> {
    return this.planRepository.findById(id, filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN
      ]
    }
  })
  @patch('/plans/{id}')
  @response(204, {
    description: 'Plan PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plan, { partial: true }),
        },
      },
    })
    plan: Plan,
  ): Promise<void> {
    await this.planRepository.updateById(id, plan);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN
      ]
    }
  })
  @put('/plans/{id}')
  @response(204, {
    description: 'Plan PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() plan: Plan,
  ): Promise<void> {
    await this.planRepository.replaceById(id, plan);
  }

  @authenticate({
    strategy: 'jwt',
    options: {
      required: [
        PermissionKeys.ADMIN
      ]
    }
  })
  @del('/plans/{id}')
  @response(204, {
    description: 'Plan DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.planRepository.deleteById(id);
  }
}
