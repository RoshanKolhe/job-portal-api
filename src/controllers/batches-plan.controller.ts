import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Batches,
  Plan,
} from '../models';
import {BatchesRepository} from '../repositories';

export class BatchesPlanController {
  constructor(
    @repository(BatchesRepository)
    public batchesRepository: BatchesRepository,
  ) { }

  @get('/batches/{id}/plan', {
    responses: {
      '200': {
        description: 'Plan belonging to Batches',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Plan),
          },
        },
      },
    },
  })
  async getPlan(
    @param.path.number('id') id: typeof Batches.prototype.id,
  ): Promise<Plan> {
    return this.batchesRepository.plan(id);
  }
}
