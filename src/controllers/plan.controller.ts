import {authenticate} from '@loopback/authentication';
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
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {PermissionKeys} from '../authorization/permission-keys';
import {JobPortalDataSource} from '../datasources';
import {Courses, Plan, Services} from '../models';
import {BatchesRepository, CoursesRepository, PlanRepository, ServicesRepository} from '../repositories';

export class PlanController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
    @repository(PlanRepository)
    public planRepository: PlanRepository,
    @repository(CoursesRepository)
    public coursesRepository: CoursesRepository,
    @repository(BatchesRepository)
    public batchesRepository: BatchesRepository,
    @repository(ServicesRepository)
    public serviceRepository: ServicesRepository,
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
    content: {'application/json': {schema: getModelSchemaRef(Plan)}},
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
                  getModelSchemaRef(Services, {
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
      productData: Omit<Courses, 'id'> | Omit<Services, 'id'>;
    },
  ): Promise<Plan> {
    const repo = new DefaultTransactionalRepository(Plan, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      const {plan, productData} = body;

      if (plan.planGroup === 0) {
        // create course
        const savedCourse = await this.coursesRepository.create(productData);

        if (savedCourse) {
          const planData = {...plan, coursesId: savedCourse.id};
          const savedPlan = await this.planRepository.create(planData);
          tx.commit();
          return await this.planRepository.findById(savedPlan.id, {include: [{relation: 'courses'}]});
        }
      }

      if (plan.planGroup === 1) {
        const serviceData = productData as Services;

        const existingService = await this.serviceRepository.findOne({
          where: {
            page:serviceData.page,
          },
        });

        if (existingService) {
          throw new HttpErrors.BadRequest(
            `The page is already assigned to the service "${existingService.serviceName}". Please choose a different page`
          );
        }

        const savedService = await this.serviceRepository.create(serviceData);

        if (savedService) {
          const planData = {...plan, servicesId: savedService.id};
          const savedPlan = await this.planRepository.create(planData);
          await tx.commit();
          return this.planRepository.findById(savedPlan.id, {
            include: [{relation: 'services'}],
          });
        }
      }

      await tx.commit();
      throw new HttpErrors.BadRequest('Incorrect product group');
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }


  @get('/plans/count')
  @response(200, {
    description: 'Plan model count',
    content: {'application/json': {schema: CountSchema}},
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
          items: getModelSchemaRef(Plan, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Plan) filter?: Filter<Plan>,
  ): Promise<Plan[]> {
    const plans = await this.planRepository.find({
      ...filter,
      include: [{
        relation: 'courses',
        scope: {
          include: [
            {relation: 'keyOutComes'},
            {relation: 'programModules'},
            {relation: 'tools'},
            {relation: 'plansFaqs'}

          ]
        },
      },
      {
        relation: 'services',
      },
      ],
      order: ['createdAt desc']
    });

    return plans;
  }

  // @get('/active-plans')
  // @response(200, {
  //   description: 'Array of Plan model instances',
  //   content: {
  //     'application/json': {
  //       schema: {
  //         type: 'array',
  //         items: getModelSchemaRef(Plan, {includeRelations: true}),
  //       },
  //     },
  //   },
  // })
  // async findActivePlans(
  //   @param.filter(Plan) filter?: Filter<Plan>,
  // ): Promise<Plan[]> {
  //   const plans = await this.planRepository.find({
  //     ...filter,
  //     include: [{
  //       relation: 'courses',
  //       scope: {
  //         include: [
  //           {relation: 'keyOutComes'},
  //           {relation: 'programModules'}
  //         ]
  //       }
  //     }],
  //     order: ['createdAt desc']
  //   });

  //   const activePlans = [];
  //   for (const plan of plans) {
  //     const date = new Date();
  //     const activeBatch = await this.batchesRepository.findOne({
  //       where: {
  //         and: [
  //           {startDate: {lte: date}},
  //           {endDate: {gte: date}},
  //           {planId: plan.id}
  //         ]
  //       }
  //     });
  //     if (activeBatch) {
  //       activePlans.push(plan);
  //     }
  //   };

  //   return activePlans;
  // }

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
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Plan, {partial: true}),
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
        schema: getModelSchemaRef(Plan, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Plan, {exclude: 'where'}) filter?: FilterExcludingWhere<Plan>
  ): Promise<any> {
    const planData = await this.planRepository.findById(id, {
      ...filter, include: [{
        relation: 'courses', scope: {
          include: [
            {relation: 'keyOutComes'},
            {relation: 'programModules'},
            {relation: 'tools'},
            {relation: 'plansFaqs'}
          ]
        }
      },
      {
        relation: 'services'
      }
      ]
    });

    const batch = await this.batchesRepository.findOne({where: {planId: planData.id}, order: ['createdAt DESC']});
    return {
      ...planData,
      batch: batch
    }
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
              plan: getModelSchemaRef(Plan, {partial: true}),
              productData: {
                oneOf: [
                  getModelSchemaRef(Courses, {partial: true}),
                  getModelSchemaRef(Services, {partial: true}),
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
      productData: Partial<Courses> | Partial<Services>;
    },
  ): Promise<void> {
    const {plan, productData} = body;

    // fetch existing plan with relations
    const existingPlan = await this.planRepository.findById(id, {include: [{relation: 'courses'}]});
    if (!existingPlan) throw new HttpErrors.NotFound('Plan not found');

    const txRepo = new DefaultTransactionalRepository(Plan, this.dataSource);
    const tx = await txRepo.beginTransaction(IsolationLevel.READ_COMMITTED);

    try {
      // Handle PlanGroup change
      if (plan.planGroup !== undefined && plan.planGroup !== existingPlan.planGroup) {
        // Delete old related data if PlanGroup changed
        if (existingPlan.planGroup === 0 && existingPlan.coursesId) {
          await this.coursesRepository.deleteById(existingPlan.coursesId);
          plan.coursesId = undefined;
        }
      }

      // Update related course if planGroup is 0
      if ((plan.planGroup === 0 || existingPlan.planGroup === 0) && existingPlan.coursesId) {
        await this.coursesRepository.updateById(existingPlan.coursesId, productData as Courses);
      }

      // Update related course if planGroup is 0
      if ((plan.planGroup === 1 || existingPlan.planGroup === 1) && existingPlan.servicesId) {
        await this.serviceRepository.updateById(existingPlan.servicesId, productData as Services);
      }

      // Update the plan itself
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
        schema: getModelSchemaRef(Plan, {includeRelations: true}),
      },
    },
  })
  async findByPlanType(
    @param.path.number('type') type: number,
    @param.filter(Plan, {exclude: 'where'}) filter?: FilterExcludingWhere<Plan>
  ): Promise<Plan[]> {
    const plans = await this.planRepository.find({
      where: {planType: type}, include: [{
        relation: 'courses', scope: {
          include: [
            {relation: 'keyOutComes'},
            {relation: 'programModules'},
            {relation: 'tools'},
            {relation: 'plansFaqs'}
          ]
        }
      }]
    }, filter);
    const activePlans = [];
    for (const plan of plans) {
      const date = new Date();
      const activeBatch = await this.batchesRepository.findOne({
        where: {
          and: [
            {startDate: {lte: date}},
            {endDate: {gte: date}},
            {planId: plan.id}
          ]
        }
      });
      if (activeBatch) {
        activePlans.push(plan);
      }
    };

    return activePlans;
  }
}
