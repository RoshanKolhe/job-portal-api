import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  User,
  Plan,
} from '../models';
import {UserRepository} from '../repositories';

export class UserPlanController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @get('/users/{id}/plan', {
    responses: {
      '200': {
        description: 'Plan belonging to User',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Plan),
          },
        },
      },
    },
  })
  async getPlan(
    @param.path.number('id') id: typeof User.prototype.id,
  ): Promise<Plan> {
    return this.userRepository.currentPlan(id);
  }
}
