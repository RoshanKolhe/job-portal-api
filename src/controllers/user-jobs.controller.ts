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
User,
SavedJobsUsersLink,
Jobs,
} from '../models';
import {UserRepository} from '../repositories';

export class UserJobsController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/jobs', {
    responses: {
      '200': {
        description: 'Array of User has many Jobs through SavedJobsUsersLink',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Jobs)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Jobs>,
  ): Promise<Jobs[]> {
    return this.userRepository.jobs(id).find(filter);
  }

  @post('/users/{id}/jobs', {
    responses: {
      '200': {
        description: 'create a Jobs model instance',
        content: {'application/json': {schema: getModelSchemaRef(Jobs)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, {
            title: 'NewJobsInUser',
            exclude: ['id'],
          }),
        },
      },
    }) jobs: Omit<Jobs, 'id'>,
  ): Promise<Jobs> {
    return this.userRepository.jobs(id).create(jobs);
  }

  @patch('/users/{id}/jobs', {
    responses: {
      '200': {
        description: 'User.Jobs PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, {partial: true}),
        },
      },
    })
    jobs: Partial<Jobs>,
    @param.query.object('where', getWhereSchemaFor(Jobs)) where?: Where<Jobs>,
  ): Promise<Count> {
    return this.userRepository.jobs(id).patch(jobs, where);
  }

  @del('/users/{id}/jobs', {
    responses: {
      '200': {
        description: 'User.Jobs DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Jobs)) where?: Where<Jobs>,
  ): Promise<Count> {
    return this.userRepository.jobs(id).delete(where);
  }
}
