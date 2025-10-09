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
  ProgramModule,
} from '../models';
import {CoursesRepository} from '../repositories';

export class CoursesProgramModuleController {
  constructor(
    @repository(CoursesRepository) protected coursesRepository: CoursesRepository,
  ) { }

  @get('/courses/{id}/program-modules', {
    responses: {
      '200': {
        description: 'Array of Courses has many ProgramModule',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ProgramModule)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<ProgramModule>,
  ): Promise<ProgramModule[]> {
    return this.coursesRepository.programModules(id).find(filter);
  }

  @post('/courses/{id}/program-modules', {
    responses: {
      '200': {
        description: 'Courses model instance',
        content: {'application/json': {schema: getModelSchemaRef(ProgramModule)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Courses.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramModule, {
            title: 'NewProgramModuleInCourses',
            exclude: ['id'],
            optional: ['coursesId']
          }),
        },
      },
    }) programModule: Omit<ProgramModule, 'id'>,
  ): Promise<ProgramModule> {
    return this.coursesRepository.programModules(id).create(programModule);
  }

  @patch('/courses/{id}/program-modules', {
    responses: {
      '200': {
        description: 'Courses.ProgramModule PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProgramModule, {partial: true}),
        },
      },
    })
    programModule: Partial<ProgramModule>,
    @param.query.object('where', getWhereSchemaFor(ProgramModule)) where?: Where<ProgramModule>,
  ): Promise<Count> {
    return this.coursesRepository.programModules(id).patch(programModule, where);
  }

  @del('/courses/{id}/program-modules', {
    responses: {
      '200': {
        description: 'Courses.ProgramModule DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(ProgramModule)) where?: Where<ProgramModule>,
  ): Promise<Count> {
    return this.coursesRepository.programModules(id).delete(where);
  }
}
