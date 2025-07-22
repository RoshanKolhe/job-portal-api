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
  Courses,
} from '../models';
import {PlanRepository} from '../repositories';

export class PlanCoursesController {
  constructor(
    @repository(PlanRepository)
    public planRepository: PlanRepository,
  ) { }

  @get('/plans/{id}/courses', {
    responses: {
      '200': {
        description: 'Courses belonging to Plan',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Courses),
          },
        },
      },
    },
  })
  async getCourses(
    @param.path.number('id') id: typeof Plan.prototype.id,
  ): Promise<Courses> {
    return this.planRepository.courses(id);
  }
}
