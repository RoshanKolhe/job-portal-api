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
import {Jobs} from '../models';
import {JobsRepository} from '../repositories';

export class JobsController {
  constructor(
    @repository(JobsRepository)
    public jobsRepository : JobsRepository,
  ) {}

  @post('/jobs')
  @response(200, {
    description: 'Jobs model instance',
    content: {'application/json': {schema: getModelSchemaRef(Jobs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, {
            title: 'NewJobs',
            exclude: ['id'],
          }),
        },
      },
    })
    jobs: Omit<Jobs, 'id'>,
  ): Promise<Jobs> {
    return this.jobsRepository.create(jobs);
  }

  @get('/jobs/count')
  @response(200, {
    description: 'Jobs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Jobs) where?: Where<Jobs>,
  ): Promise<Count> {
    return this.jobsRepository.count(where);
  }

  @get('/jobs')
  @response(200, {
    description: 'Array of Jobs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Jobs, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Jobs) filter?: Filter<Jobs>,
  ): Promise<Jobs[]> {
    return this.jobsRepository.find(filter);
  }

  @patch('/jobs')
  @response(200, {
    description: 'Jobs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, {partial: true}),
        },
      },
    })
    jobs: Jobs,
    @param.where(Jobs) where?: Where<Jobs>,
  ): Promise<Count> {
    return this.jobsRepository.updateAll(jobs, where);
  }

  @get('/jobs/{id}')
  @response(200, {
    description: 'Jobs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Jobs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Jobs, {exclude: 'where'}) filter?: FilterExcludingWhere<Jobs>
  ): Promise<Jobs> {
    return this.jobsRepository.findById(id, filter);
  }

  @patch('/jobs/{id}')
  @response(204, {
    description: 'Jobs PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, {partial: true}),
        },
      },
    })
    jobs: Jobs,
  ): Promise<void> {
    await this.jobsRepository.updateById(id, jobs);
  }

  @put('/jobs/{id}')
  @response(204, {
    description: 'Jobs PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() jobs: Jobs,
  ): Promise<void> {
    await this.jobsRepository.replaceById(id, jobs);
  }

  @del('/jobs/{id}')
  @response(204, {
    description: 'Jobs DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.jobsRepository.deleteById(id);
  }
}
