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
  Tools,
} from '../models';
import {CoursesRepository} from '../repositories';

export class CoursesToolsController {
  constructor(
    @repository(CoursesRepository) protected coursesRepository: CoursesRepository,
  ) { }

  @get('/courses/{id}/tools', {
    responses: {
      '200': {
        description: 'Array of Courses has many Tools',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Tools)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Tools>,
  ): Promise<Tools[]> {
    return this.coursesRepository.tools(id).find(filter);
  }

  @post('/courses/{id}/tools', {
    responses: {
      '200': {
        description: 'Courses model instance',
        content: {'application/json': {schema: getModelSchemaRef(Tools)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Courses.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tools, {
            title: 'NewToolsInCourses',
            exclude: ['id'],
            optional: ['coursesId']
          }),
        },
      },
    }) tools: Omit<Tools, 'id'>,
  ): Promise<Tools> {
    return this.coursesRepository.tools(id).create(tools);
  }

  @patch('/courses/{id}/tools', {
    responses: {
      '200': {
        description: 'Courses.Tools PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tools, {partial: true}),
        },
      },
    })
    tools: Partial<Tools>,
    @param.query.object('where', getWhereSchemaFor(Tools)) where?: Where<Tools>,
  ): Promise<Count> {
    return this.coursesRepository.tools(id).patch(tools, where);
  }

  @del('/courses/{id}/tools', {
    responses: {
      '200': {
        description: 'Courses.Tools DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Tools)) where?: Where<Tools>,
  ): Promise<Count> {
    return this.coursesRepository.tools(id).delete(where);
  }
}
