import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {Resume} from '../models';
import {ResumeRepository, UserRepository} from '../repositories';

export class ResumeController {
  constructor(
    @repository(ResumeRepository)
    public resumeRepository: ResumeRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/resumes')
  @response(200, {
    description: 'Resume created or LinkedIn URL updated',
    content: {'application/json': {schema: getModelSchemaRef(Resume)}},
  })
  @authenticate('jwt')
  async create(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ...getModelSchemaRef(Resume, {
                title: 'NewResume',
                exclude: ['id'],
              }).definitions?.Resume?.properties,
              linkedinUrl: {type: 'string'},
              fileDetails: {type: 'object'},
            },
          },
        },
      },
    })
    body: any,
  ): Promise<{message: string; success: boolean}> {
    const {linkedinUrl, fileDetails, ...resumeRaw} = body;

    // ❌ If both missing, throw error
    if (!linkedinUrl && !fileDetails) {
      throw new HttpErrors.BadRequest(
        'At least one of linkedinUrl or fileDetails must be provided.',
      );
    }

    // ✅ Update user if linkedinUrl present
    if (linkedinUrl) {
      await this.userRepository.updateById(currentUser.id, {linkedinUrl});
    }

    // ✅ Create resume if fileDetails present
    if (fileDetails) {
      const resume: Partial<Omit<Resume, 'id'>> = {
        ...resumeRaw,
        fileDetails,
        userId: currentUser.id,
      };

      await this.resumeRepository.create(resume as Omit<Resume, 'id'>);
    }

    return {message: 'uploaded successfully.', success: true};
  }

  @get('/resumes')
  @response(200, {
    description: 'Array of Resume model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Resume, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Resume) filter?: Filter<Resume>): Promise<Resume[]> {
    return this.resumeRepository.find(filter);
  }

  @patch('/resumes')
  @response(200, {
    description: 'Resume PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resume, {partial: true}),
        },
      },
    })
    resume: Resume,
    @param.where(Resume) where?: Where<Resume>,
  ): Promise<Count> {
    return this.resumeRepository.updateAll(resume, where);
  }

  @get('/resumes/{id}')
  @response(200, {
    description: 'Resume model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Resume, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Resume, {exclude: 'where'})
    filter?: FilterExcludingWhere<Resume>,
  ): Promise<Resume> {
    return this.resumeRepository.findById(id, filter);
  }

  @patch('/resumes/{id}')
  @response(204, {
    description: 'Resume PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resume, {partial: true}),
        },
      },
    })
    resume: Resume,
  ): Promise<void> {
    await this.resumeRepository.updateById(id, resume);
  }

  @put('/resumes/{id}')
  @response(204, {
    description: 'Resume PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() resume: Resume,
  ): Promise<void> {
    await this.resumeRepository.replaceById(id, resume);
  }

  @del('/resumes/{id}')
  @response(204, {
    description: 'Resume DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.resumeRepository.deleteById(id);
  }
}
