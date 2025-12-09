import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Resume,
  User,
} from '../models';
import {ResumeRepository} from '../repositories';

export class ResumeUserController {
  constructor(
    @repository(ResumeRepository)
    public resumeRepository: ResumeRepository,
  ) { }

  @get('/resumes/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Resume',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof Resume.prototype.id,
  ): Promise<User> {
    return this.resumeRepository.user(id);
  }
}
