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
  Request,
  requestBody,
  response,
  RestBindings,
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import FormData from 'form-data';
import fs from 'fs';
import * as isEmail from 'isemail';
import path from 'path';
import {PermissionKeys} from '../authorization/permission-keys';
import apiClient from '../interceptors/axios-client.interceptor';
import {STORAGE_DIRECTORY} from '../keys';
import {Resume} from '../models';
import {ResumeRepository, UserRepository} from '../repositories';
import {EventHistoryService} from '../services/event-history.service';
import {BcryptHasher} from '../services/hash.password.bcrypt';

export class ResumeController {
  constructor(
    @repository(ResumeRepository)
    public resumeRepository: ResumeRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
    @inject('service.hasher') public hasher: BcryptHasher,
    @inject('service.eventhistory.service')
    public eventHistoryService: EventHistoryService,
  ) { }

  // post new resume for login users
  @authenticate({
    strategy: 'jwt',
  })
  @post('/resumes')
  @response(200, {
    description: 'Resume model instance',
    content: {'application/json': {schema: getModelSchemaRef(Resume)}},
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @inject(RestBindings.Http.REQUEST) request: Request,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resume, {
            title: 'NewResume',
            exclude: ['id'],
          }),
        },
      },
    })
    resume: Omit<Resume, 'id'>,
  ): Promise<{success: boolean; message: string; resume: Resume; apiDurations: {endpoint: string; duration: string} | null}> {
    const requestId = request.headers['x-request-id'] || '';
    try {
      const user = await this.userRepository.findById(currentUser.id);

      if (!user || !user.id) {
        throw new HttpErrors.BadRequest('User not found');
      }

      const resumeData: Resume = {
        ...resume,
        userId: user.id
      };

      if (user.id) {
        await this.eventHistoryService.addNewEvent(
          'resume upload',
          'resume uploaded done',
          'resume-upload-page',
          user.id
        );
      }

      const savedResume: any = await this.resumeRepository.create(resumeData);

      const filePath = this.validateFileName(savedResume?.fileDetails?.newFileName);
      const resumeFile = fs.createReadStream(filePath);

      const form = new FormData();
      form.append("resume_file", resumeFile);
      form.append("resume_id", savedResume?.id?.toString() || "");
      form.append("user_id", savedResume?.userId?.toString() || "");

      // sending resume to yashwants api
      if (savedResume) {
        const apiResponse: any = await apiClient.post(
          `${process.env.SERVER_URL}/api/resume/upload`,
          form,
          {
            headers: {
              "X-apiKey": "2472118222258182",
              ...form.getHeaders(),
              "X-request-id": requestId.toString()
            },
          }
        );

        const {duration} = apiResponse;
        console.log('Response time for => /api/resume/upload:', duration);

        console.log('Response from AI server', apiResponse.data);
        return {
          success: true,
          message: 'Resume Saved',
          resume: savedResume,
          apiDurations: {endpoint: '/api/resume/upload', duration: duration}
        };
      }

      return {
        success: true,
        message: 'Resume saved',
        resume: savedResume,
        apiDurations: null
      }
    } catch (error) {
      console.log('error in resumes upload', error);
      throw error;
    }
  }

  // validate file path...
  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }

  // get user info...
  async getUserInfo(
    fileDetails: any): Promise<any> {
    try {
      const filePath = this.validateFileName(fileDetails.newFileName);
      if (!filePath) throw new HttpErrors.NotFound('Resume Not Found');

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('user_id', `1`);
      formData.append('X-apiKey', '2472118222258182');

      const response: any = await apiClient.post(
        process.env.SERVER_URL + '/fobo/user-details',
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      const {duration} = response;
      console.log('Response time for => /fobo/user-details:', duration);

      const {Name, Email, Phone} = response.data?.data || {};

      if (Name && Email && Phone && isEmail.validate(Email)) {
        const existing = await this.userRepository.findOne({where: {email: Email}});

        if (!existing) {
          const password = await this.hasher.generateRandomPassword();
          const hashedPassword = await this.hasher.hashPassword(password);

          const user = await this.userRepository.create({
            fullName: Name,
            email: Email,
            phoneNumber: Phone,
            isActive: true,
            isDeleted: false,
            password: hashedPassword,
            permissions: ['customer'],
          });

          if (user.id) {
            await this.eventHistoryService.addNewEvent(
              'user registration with resume upload',
              'user registration with resume upload of user done',
              'resume-upload-page',
              user.id
            );

            await this.eventHistoryService.addNewEvent(
              'resume upload',
              'resume upload of user done',
              'resume-upload-page',
              user.id
            );
          }
          return {user, apiDuration: {endpoint: '/fobo/user-details', duration}};
        }

        return {user: existing, apiDuration: {endpoint: '/fobo/user-details', duration}};
      }

      return null;

    } catch (error: any) {
      console.error('❌ Error in getUserInfo:', error);

      if (error.response) {
        const status = error.response?.status || 500;
        const apiMessage = error.response?.data?.message || 'Unknown error';
        const apiErrorCode = error.response?.data?.error_code || null;
        const duration = error.duration || null;

        const ErrorMap: Record<number, any> = {
          400: HttpErrors.BadRequest,
          401: HttpErrors.Unauthorized,
          403: HttpErrors.Forbidden,
          404: HttpErrors.NotFound,
          409: HttpErrors.Conflict,
          422: HttpErrors.UnprocessableEntity,
          500: HttpErrors.InternalServerError,
        };

        const ErrorClass = ErrorMap[status] || HttpErrors.InternalServerError;

        throw new ErrorClass(apiMessage);
      }

      throw new HttpErrors.InternalServerError('Unexpected server error');
    }
  }

  // post resume for guest users...
  @post('/resumes/guest-upload')
  async guestUploadResume(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resume, {
            title: 'NewResume',
            exclude: ['id'],
          }),
        },
      },
    })
    resume: Omit<Resume, 'id'>,
  ): Promise<{success: boolean; message: string; resume: Resume; apiDurations: Array<{endpoint: string; duration: string}> | null}> {
    const requestId = request.headers['x-request-id'] || '';
    try {
      const {fileDetails} = resume;
      const {data} = await this.getUserInfo(fileDetails);

      if (data) {
        const newResume: any = await this.resumeRepository.create({...resume, userId: data?.user?.id});
        const filePath = this.validateFileName(newResume?.fileDetails?.newFileName);
        const resumeFile = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("resume_file", resumeFile);
        form.append("resume_id", newResume?.id?.toString() || "");
        form.append("user_id", newResume?.userId?.toString() || "");

        // sending resume to yashwants api
        if (newResume) {
          const apiResponse: any = await apiClient.post(
            `${process.env.SERVER_URL}/api/resume/upload`,
            form,
            {
              headers: {
                "X-apiKey": "2472118222258182",
                ...form.getHeaders(),
                "X-request-id": requestId.toString()
              },
            }
          );
          const {duration} = apiResponse;
          console.log('Response time for => /api/resume/upload:', duration);

          console.log('Response from AI server', apiResponse.data);
          return {
            success: true,
            message: 'Guest resume saved',
            resume: newResume,
            apiDurations: [
              ...data?.apiDuration,
              {
                endpoint: '/api/resume/upload',
                duration: duration
              }
            ]
          };
        }

        return {
          success: true,
          message: 'Guest resume saved',
          resume: newResume,
          apiDurations: [
            ...data?.apiDuration,
          ]
        };
      }

      const resumeData = await this.resumeRepository.create(resume);
      return {
        success: true,
        message: 'Guest resume saved',
        resume: resumeData,
        apiDurations: null
      };
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  @get('/resumes/count')
  @response(200, {
    description: 'Resume model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Resume) where?: Where<Resume>,
  ): Promise<Count> {
    return this.resumeRepository.count(where);
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
  async find(
    @param.filter(Resume) filter?: Filter<Resume>,
  ): Promise<Resume[]> {
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
    @param.filter(Resume, {exclude: 'where'}) filter?: FilterExcludingWhere<Resume>
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

  // resumes by userId
  @authenticate({
    strategy: 'jwt',
    options: {required: [PermissionKeys.ADMIN]}
  })
  @get('/resumes/resume-by-id/{userId}')
  async fetchResumesByUserId(
    @param.path.number('userId') userId: number,
  ): Promise<Resume[]> {
    try {
      const resumes = await this.resumeRepository.find({where: {userId: userId}});

      return resumes;
    } catch (error) {
      throw error;
    }
  }

  // change guest users resume to userId
  @authenticate('jwt')
  @patch('/resumes/convert-guest-to-user')
  async updateBulkResumeForGuest(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['resumeIds'],
            properties: {
              resumeIds: {
                type: 'array',
                items: {
                  type: 'number'
                }
              }
            }
          }
        }
      }
    })
    resumes: {
      resumeIds: number[];
    }
  ) {
    await this.resumeRepository.updateAll({userId: currentUser.id}, {id: {inq: resumes.resumeIds}});

    return {
      success: true,
      message: 'Resume Update success',
    }
  }
}
