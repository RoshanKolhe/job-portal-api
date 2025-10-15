import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Courses,
  PlansFaq,
} from '../models';
import {CoursesRepository} from '../repositories';

export class CoursesPlansFaqController {
  constructor(
    @repository(CoursesRepository) protected coursesRepository: CoursesRepository,
  ) { }

  @get('/courses/{id}/plans-faqs', {
    responses: {
      '200': {
        description: 'Array of Courses has many PlansFaq',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PlansFaq)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<PlansFaq>,
  ): Promise<PlansFaq[]> {
    return this.coursesRepository.plansFaqs(id).find(filter);
  }

  @post('/courses/{id}/plans-faqs', {
    responses: {
      '200': {
        description: 'Courses model instance',
        content: {'application/json': {schema: getModelSchemaRef(PlansFaq)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Courses.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlansFaq, {
            title: 'NewPlansFaqInCourses',
            exclude: ['id'],
            optional: ['coursesId']
          }),
        },
      },
    }) plansFaq: Omit<PlansFaq, 'id'>,
  ): Promise<PlansFaq> {
    return this.coursesRepository.plansFaqs(id).create(plansFaq);
  }

  @patch('/courses/{id}/plans-faqs', {
    responses: {
      '200': {
        description: 'Courses.PlansFaq PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlansFaq, {partial: true}),
        },
      },
    })
    plansFaq: Partial<PlansFaq>,
    @param.query.object('where', getWhereSchemaFor(PlansFaq)) where?: Where<PlansFaq>,
  ): Promise<Count> {
    return this.coursesRepository.plansFaqs(id).patch(plansFaq, where);
  }

  @del('/courses/{id}/plans-faqs', {
    responses: {
      '200': {
        description: 'Courses.PlansFaq DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(PlansFaq)) where?: Where<PlansFaq>,
  ): Promise<Count> {
    return this.coursesRepository.plansFaqs(id).delete(where);
  }
}
