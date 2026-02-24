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
import { CourseRegistrationInterest } from '../models';
import { CourseRegistrationInterestRepository } from '../repositories';
import { authenticate } from '@loopback/authentication';
import { PermissionKeys } from '../authorization/permission-keys';

export class CourseRegistrationInterestController {
  constructor(
    @repository(CourseRegistrationInterestRepository)
    public courseRegistrationInterestRepository: CourseRegistrationInterestRepository,
  ) { }

  @post('/course-registration-interests')
  @response(200, {
    description: 'CourseRegistrationInterest model instance',
    content: { 'application/json': { schema: getModelSchemaRef(CourseRegistrationInterest) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CourseRegistrationInterest, {
            title: 'NewCourseRegistrationInterest',
            exclude: ['id'],
          }),
        },
      },
    })
    courseRegistrationInterest: Omit<CourseRegistrationInterest, 'id'>,
  ): Promise<CourseRegistrationInterest> {
    return this.courseRegistrationInterestRepository.create(courseRegistrationInterest);
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN] }
  // })
  // @get('/course-registration-interests/count')
  // @response(200, {
  //   description: 'CourseRegistrationInterest model count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async count(
  //   @param.where(CourseRegistrationInterest) where?: Where<CourseRegistrationInterest>,
  // ): Promise<Count> {
  //   return this.courseRegistrationInterestRepository.count(where);
  // }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN] }
  })
  @get('/course-registration-interests')
  @response(200, {
    description: 'Array of CourseRegistrationInterest model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CourseRegistrationInterest, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(CourseRegistrationInterest) filter?: Filter<CourseRegistrationInterest>,
  ): Promise<CourseRegistrationInterest[]> {
    return this.courseRegistrationInterestRepository.find(filter);
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN] }
  // })
  // @patch('/course-registration-interests')
  // @response(200, {
  //   description: 'CourseRegistrationInterest PATCH success count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(CourseRegistrationInterest, { partial: true }),
  //       },
  //     },
  //   })
  //   courseRegistrationInterest: CourseRegistrationInterest,
  //   @param.where(CourseRegistrationInterest) where?: Where<CourseRegistrationInterest>,
  // ): Promise<Count> {
  //   return this.courseRegistrationInterestRepository.updateAll(courseRegistrationInterest, where);
  // }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN] }
  })
  @get('/course-registration-interests/{id}')
  @response(200, {
    description: 'CourseRegistrationInterest model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CourseRegistrationInterest, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(CourseRegistrationInterest, { exclude: 'where' }) filter?: FilterExcludingWhere<CourseRegistrationInterest>
  ): Promise<CourseRegistrationInterest> {
    return this.courseRegistrationInterestRepository.findById(id, filter);
  }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN] }
  // })
  // @patch('/course-registration-interests/{id}')
  // @response(204, {
  //   description: 'CourseRegistrationInterest PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(CourseRegistrationInterest, { partial: true }),
  //       },
  //     },
  //   })
  //   courseRegistrationInterest: CourseRegistrationInterest,
  // ): Promise<void> {
  //   await this.courseRegistrationInterestRepository.updateById(id, courseRegistrationInterest);
  // }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN] }
  // })
  // @put('/course-registration-interests/{id}')
  // @response(204, {
  //   description: 'CourseRegistrationInterest PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() courseRegistrationInterest: CourseRegistrationInterest,
  // ): Promise<void> {
  //   await this.courseRegistrationInterestRepository.replaceById(id, courseRegistrationInterest);
  // }

  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN] }
  // })
  // @del('/course-registration-interests/{id}')
  // @response(204, {
  //   description: 'CourseRegistrationInterest DELETE success',
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.courseRegistrationInterestRepository.deleteById(id);
  // }
}
