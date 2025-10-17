import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Plan,
  Services,
} from '../models';
import {PlanRepository} from '../repositories';

export class PlanServicesController {
  constructor(
    @repository(PlanRepository)
    public planRepository: PlanRepository,
  ) { }

  @get('/plans/{id}/services', {
    responses: {
      '200': {
        description: 'Services belonging to Plan',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Services),
          },
        },
      },
    },
  })
  async getServices(
    @param.path.number('id') id: typeof Plan.prototype.id,
  ): Promise<Services> {
    return this.planRepository.services(id);
  }
}
