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
  KeyOutComes,
} from '../models';
import {CoursesRepository} from '../repositories';

export class CoursesKeyOutComesController {
  constructor(
    @repository(CoursesRepository) protected coursesRepository: CoursesRepository,
  ) { }

  @get('/courses/{id}/key-out-comes', {
    responses: {
      '200': {
        description: 'Array of Courses has many KeyOutComes',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(KeyOutComes)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<KeyOutComes>,
  ): Promise<KeyOutComes[]> {
    return this.coursesRepository.keyOutComes(id).find(filter);
  }

  @post('/courses/{id}/key-out-comes', {
    responses: {
      '200': {
        description: 'Courses model instance',
        content: {'application/json': {schema: getModelSchemaRef(KeyOutComes)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Courses.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KeyOutComes, {
            title: 'NewKeyOutComesInCourses',
            exclude: ['id'],
            optional: ['coursesId']
          }),
        },
      },
    }) keyOutComes: Omit<KeyOutComes, 'id'>,
  ): Promise<KeyOutComes> {
    return this.coursesRepository.keyOutComes(id).create(keyOutComes);
  }

  @patch('/courses/{id}/key-out-comes', {
    responses: {
      '200': {
        description: 'Courses.KeyOutComes PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(KeyOutComes, {partial: true}),
        },
      },
    })
    keyOutComes: Partial<KeyOutComes>,
    @param.query.object('where', getWhereSchemaFor(KeyOutComes)) where?: Where<KeyOutComes>,
  ): Promise<Count> {
    return this.coursesRepository.keyOutComes(id).patch(keyOutComes, where);
  }

  @del('/courses/{id}/key-out-comes', {
    responses: {
      '200': {
        description: 'Courses.KeyOutComes DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(KeyOutComes)) where?: Where<KeyOutComes>,
  ): Promise<Count> {
    return this.coursesRepository.keyOutComes(id).delete(where);
  }
}
