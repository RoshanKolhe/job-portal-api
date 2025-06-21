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
  Resume,
} from '../models';
import {EventHistoryRepository} from '../repositories';

export class EventHistoryResumeController {
  constructor(
    @repository(EventHistoryRepository)
    public eventHistoryRepository: EventHistoryRepository,
  ) { }

  @get('/event-histories/{id}/resume', {
    responses: {
      '200': {
        description: 'Resume belonging to EventHistory',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Resume),
          },
        },
      },
    },
  })
  async getResume(
    @param.path.number('id') id: typeof EventHistory.prototype.id,
  ): Promise<Resume> {
    return this.eventHistoryRepository.resume(id);
  }
}
