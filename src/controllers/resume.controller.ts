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
  HttpErrors,
} from '@loopback/rest';
import { Resume, User } from '../models';
import { ResumeRepository, UserRepository } from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { UserProfile } from '@loopback/security';
import fs from 'fs';
import FormData from 'form-data';
import path from 'path';
import { STORAGE_DIRECTORY } from '../keys';
import axios from 'axios';
import * as isEmail from 'isemail';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { EventHistoryService } from '../services/event-history.service';
import { PermissionKeys } from '../authorization/permission-keys';

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
    content: { 'application/json': { schema: getModelSchemaRef(Resume) } },
  })
  async create(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
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
  ): Promise<Resume> {
    try {
      const user = await this.userRepository.findById(currentUser.id);

      if (!user) {
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
        const apiResponse = await axios.post(
          `${process.env.SERVER_URL}/api/resume/upload`,
          form,
          {
            headers: {
              "X-apiKey": "2472118222258182",
              ...form.getHeaders(),
            },
          }
        );

        console.log('Response from AI server', apiResponse.data);
      }

      return savedResume;
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
  async getUserInfo(fileDetails: any): Promise<any> {
    try {
      const filePath = this.validateFileName(fileDetails.newFileName);
      if (!filePath) throw new HttpErrors.NotFound('Resume Not Found');

      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      formData.append('user_id', `1`);
      formData.append('X-apiKey', '2472118222258182');

      const response = await axios.post(process.env.SERVER_URL + '/fobo/user-details', formData, {
        headers: formData.getHeaders(),
      });

      const { Name, Email, Phone } = response.data?.data || {};

      if (Name && Email && Phone && isEmail.validate(Email)) {
        const existing = await this.userRepository.findOne({ where: { email: Email } });

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
          return user;
        }
        return existing;
      }

      return null;

    } catch (error) {
      console.error('Error in getUserInfo:', error.message, error.stack);
      throw new HttpErrors.InternalServerError('Failed to fetch user info');
    }
  }

  // post resume for guest users...
  @post('/resumes/guest-upload')
  async guestUploadResume(
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
  ): Promise<Resume> {
    try {
      const { fileDetails } = resume;
      const data = await this.getUserInfo(fileDetails);

      if (data) {
        const newResume: any = await this.resumeRepository.create({ ...resume, userId: data?.id });
        const filePath = this.validateFileName(newResume?.fileDetails?.newFileName);
        const resumeFile = fs.createReadStream(filePath);
        const form = new FormData();
        form.append("resume_file", resumeFile);
        form.append("resume_id", newResume?.id?.toString() || "");
        form.append("user_id", newResume?.userId?.toString() || "");

        // sending resume to yashwants api
        if (newResume) {
          const apiResponse = await axios.post(
            `${process.env.SERVER_URL}/api/resume/upload`,
            form,
            {
              headers: {
                "X-apiKey": "2472118222258182",
                ...form.getHeaders(),
              },
            }
          );

          console.log('Response from AI server', apiResponse.data);
        }
        return newResume;
      }

      const resumeData = await this.resumeRepository.create(resume);
      return resumeData;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  @get('/resumes/count')
  @response(200, {
    description: 'Resume model count',
    content: { 'application/json': { schema: CountSchema } },
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
          items: getModelSchemaRef(Resume, { includeRelations: true }),
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
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Resume, { partial: true }),
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
        schema: getModelSchemaRef(Resume, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Resume, { exclude: 'where' }) filter?: FilterExcludingWhere<Resume>
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
          schema: getModelSchemaRef(Resume, { partial: true }),
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
    options: { required: [PermissionKeys.ADMIN] }
  })
  @get('/resumes/resume-by-id/{userId}')
  async fetchResumesByUserId(
    @param.path.number('userId') userId: number,
  ): Promise<Resume[]> {
    try {
      const resumes = await this.resumeRepository.find({ where: { userId: userId } });

      return resumes;
    } catch (error) {
      throw error;
    }
  }
}
