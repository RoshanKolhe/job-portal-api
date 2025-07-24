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
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import { Courses, Jobs, Plan } from '../models';
import { CoursesRepository, PlanRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';
import { inject } from '@loopback/core';
import { JobPortalDataSource } from '../datasources';

export class PlanController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
    @repository(PlanRepository)
    public planRepository: PlanRepository,
    @repository(CoursesRepository)
    public coursesRepository: CoursesRepository,
  ) { }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: {
  //     required: [
  //       PermissionKeys.ADMIN
  //     ]
  //   }
  // })
  @post('/plans')
  @response(200, {
    description: 'Plan model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Plan) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              plan: getModelSchemaRef(Plan, {
                title: 'NewPlan',
                exclude: ['id'],
              }),
              productData: {
                oneOf: [
                  getModelSchemaRef(Courses, {
                    title: 'NewCourse',
                    exclude: ['id'],
                  }),
                  getModelSchemaRef(Jobs, {
                    title: 'NewService',
                    exclude: ['id'],
                  }),
                ],
              },
            },
            required: ['plan', 'productData'],
          },
        },
      },
    })
    body: {
      plan: Omit<Plan, 'id'>;
      productData: Omit<Courses, 'id'> | Omit<Jobs, 'id'>;
    },
  ): Promise<Plan> {
    const repo = new DefaultTransactionalRepository(Plan, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      const { plan, productData } = body;

      if (plan.planGroup === 0) {
        // create course

        const savedCourse = await this.coursesRepository.create(productData);

        if (savedCourse) {
          const planData = { ...plan, coursesId: savedCourse.id };
          const savedPlan = await this.planRepository.create(planData);
          tx.commit();
          return await this.planRepository.findById(savedPlan.id, { include: [{ relation: 'courses' }] });
        }
      }

      // if(plan.planGroup === 1){
      //   // create service
      // }

      tx.commit();
      throw new HttpErrors.BadRequest('Incorrect product group');
    } catch (error) {
      tx.rollback();
      throw error;
    }
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
    return this.planRepository.find({ ...filter, include: [{ relation: 'courses' }] });
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
    return this.planRepository.findById(id, {...filter, include: [{relation : 'courses'}]});
  }

  @patch('/plans/{id}')
  @response(200, {
    description: 'Plan PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              plan: getModelSchemaRef(Plan, { partial: true }),
              productData: {
                oneOf: [
                  getModelSchemaRef(Courses, { partial: true }),
                  getModelSchemaRef(Jobs, { partial: true }),
                ],
              },
            },
            required: ['plan', 'productData'],
          },
        },
      },
    })
    body: {
      plan: Partial<Plan>;
      productData: Partial<Courses> | Partial<Jobs>;
    },
  ): Promise<void> {
    const { plan, productData } = body;
    const existingPlan = await this.planRepository.findById(id);

    if (!existingPlan) throw new HttpErrors.NotFound('Plan not found');

    const txRepo = new DefaultTransactionalRepository(Plan, this.dataSource);
    const tx = await txRepo.beginTransaction(IsolationLevel.READ_COMMITTED);

    try {
      if (plan.planGroup !== undefined && plan.planGroup !== existingPlan.planGroup) {
        // PlanGroup changed, handle switch
        if (existingPlan.planGroup === 0 && existingPlan.coursesId) {
          await this.coursesRepository.deleteById(existingPlan.coursesId);
        }
        // if (existingPlan.planGroup === 1 && existingPlan.jobsId) {
        //   await this.jobsRepository.deleteById(existingPlan.jobsId);
        // }

        if (plan.planGroup === 0) {
          const newCourse = await this.coursesRepository.create(productData as Courses);
          plan.coursesId = newCourse.id;
          // plan.jobsId = undefined;
        } 
        // else if (plan.planGroup === 1) {
        //   const newJob = await this.jobsRepository.create(productData as Jobs);
        //   plan.jobsId = newJob.id;
        //   plan.coursesId = undefined;
        // } 
        else {
          throw new HttpErrors.BadRequest('Invalid planGroup');
        }
      }

      await this.planRepository.updateById(id, plan);
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
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

  @get('/plans/plan-by-type/{type}')
  @response(200, {
    description: 'Plan model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Plan, { includeRelations: true }),
      },
    },
  })
  async findByPlanType(
    @param.path.number('type') type: number,
    @param.filter(Plan, { exclude: 'where' }) filter?: FilterExcludingWhere<Plan>
  ): Promise<Plan[]> {
    return this.planRepository.find({ where: { planType: type }, include: [{relation: 'courses'}] }, filter);
  }
}
