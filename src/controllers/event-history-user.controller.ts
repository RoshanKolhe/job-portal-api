import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  EventHistory,
  User,
} from '../models';
import {EventHistoryRepository} from '../repositories';

export class EventHistoryUserController {
  constructor(
    @repository(EventHistoryRepository)
    public eventHistoryRepository: EventHistoryRepository,
  ) { }

  @get('/event-histories/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to EventHistory',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof EventHistory.prototype.id,
  ): Promise<User> {
    return this.eventHistoryRepository.user(id);
  }
}
