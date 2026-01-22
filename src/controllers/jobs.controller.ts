/* eslint-disable @typescript-eslint/naming-convention */
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
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
import { UserProfile } from '@loopback/security';
import axios from 'axios';
import { PermissionKeys } from '../authorization/permission-keys';
import apiClient from '../interceptors/axios-client.interceptor';
import { Jobs } from '../models';
import { JobsRepository, ResumeRepository, SavedJobsUsersLinkRepository, UserRepository } from '../repositories';
import { JWTService } from '../services/jwt-service';
import { RequesIDService } from '../services/request-id.service';

export class JobsController {
  constructor(
    @repository(JobsRepository)
    public jobsRepository: JobsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ResumeRepository)
    public resumeRepository: ResumeRepository,
    @repository(SavedJobsUsersLinkRepository)
    public savedJobsUsersLinkRepository: SavedJobsUsersLinkRepository,
    @inject('service.jwt.service')
    public jwtService: JWTService,
    @inject('service.RequesID.service')
    private requestIdService: RequesIDService
  ) { }

  // fetching token from header and returning userProfile...
  private async validateCredentials(authHeader: string) {
    try {
      if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length !== 2) {
          throw new HttpErrors.BadRequest('Verify token! incorrect signature');
        }
        const token = parts[1];
        const userProfile = await this.jwtService.verifyToken(token);

        return userProfile
      }
    } catch (error) {
      throw error;
    }
  }

  // Add bulk jobs ==> for adding data
  @post("/add-bulk-jobs")
  async addJobs(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: getModelSchemaRef(Jobs, { includeRelations: true }),
          }
        }
      }
    })
    jobsData: Omit<Jobs, 'id'>[]
  ): Promise<{ success: boolean; message: string; }> {
    const tx = await this.jobsRepository.dataSource.beginTransaction({ IsolationLevel: IsolationLevel.READ_COMMITTED });
    try {
      await this.jobsRepository.createAll(jobsData, {transaction: tx});

      await tx.commit();
      return {
        message: "Jobs Added successfully",
        success: true
      }
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }

  // Store to yashwants db
  @post("/post-job")
  async postJobTo(): Promise<{ success: boolean; message: string; count: number }> {
    const jobs = await this.jobsRepository.find();
    let count = 0;
    if (jobs.length > 0) {
      for (const job of jobs) {
        const jobObject = {
          job_id: job.id?.toString(),
          title: job.jobTitle,
          company: job.company,
          Location: job.location,
          Description: job.description,
          Skills: job.skillRequirements,
          Salary: job.salaryRange,
          "Experience Range": job.experience,
          Job_Type: job.jobType,
          Posted_Date: job.postedAt,
          RedirectURL: job.redirectUrl,
        };

        console.log('job object', jobObject);
        try {
          const apiResponse = await axios.post(
            "http://164.52.221.77:7483/api/jd/process",
            jobObject,
            {
              headers: {
                "X-apiKey": process.env.X_API_KEY || '',
              },
            }
          );
          console.log(`✅ Job ${job.id} posted successfully`, apiResponse.data);

          await this.jobsRepository.updateById(job.id, { isAsync: true });
          count = count + 1;
        } catch (error) {
          // console.error(`❌ Failed to post job ${job.id}:`, error.message);
          continue;
        }
      }
    }

    return ({
      success: true,
      message: "Jobs posted to yashwants api",
      count: count
    })
  }

  @post('/jobs')
  @response(200, {
    description: 'Jobs model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Jobs) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Jobs, {
            title: 'NewJobs',
            exclude: ['id'],
          }),
        },
      },
    })
    jobs: Omit<Jobs, 'id'>,
  ): Promise<Jobs> {
    return this.jobsRepository.create(jobs);
  }

  // @get('/jobs/count')
  // @response(200, {
  //   description: 'Jobs model count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async count(
  //   @param.where(Jobs) where?: Where<Jobs>,
  // ): Promise<Count> {
  //   return this.jobsRepository.count(where);
  // }

  @get('/jobs')
  @response(200, {
    description: 'Array of Jobs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Jobs, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.filter(Jobs) filter?: Filter<Jobs>,
  ): Promise<(Jobs & { isSaved?: boolean })[]> {
    try {
      const jobs: any = await this.jobsRepository.find(filter);
      // current User profile
      let currentUser: any = null;
      const authHeader = request.headers.authorization;

      if (authHeader && authHeader !== '' && authHeader !== null && authHeader !== undefined && authHeader !== 'Bearer') {
        currentUser = await this.validateCredentials(authHeader);
      }

      let user: any = null;

      if (currentUser) {
        user = await this.userRepository.findById(currentUser.id);
      };

      if (!user) {
        return jobs;
      }

      // Add isSaved & isApplied flags
      const newJobs: (Jobs & { isSaved?: boolean; isApplied?: boolean })[] = [];

      for (const job of jobs) {
        const link = await this.savedJobsUsersLinkRepository.findOne({
          where: { and: [{ jobsId: job.id }, { userId: user.id }] },
        });

        newJobs.push({
          ...job,
          isSaved: !!link?.isSaved,
          isApplied: !!link?.isApplied,
        });
      }

      return newJobs;

    } catch (error) {
      throw error;
    }
  }

  // @patch('/jobs')
  // @response(200, {
  //   description: 'Jobs PATCH success count',
  //   content: { 'application/json': { schema: CountSchema } },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Jobs, { partial: true }),
  //       },
  //     },
  //   })
  //   jobs: Jobs,
  //   @param.where(Jobs) where?: Where<Jobs>,
  // ): Promise<Count> {
  //   return this.jobsRepository.updateAll(jobs, where);
  // }

  @get('/jobs/{id}')
  @response(200, {
    description: 'Jobs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Jobs, { includeRelations: true }),
      },
    },
  })
  async findById(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.path.number('id') id: number,
    @param.filter(Jobs, { exclude: 'where' }) filter?: FilterExcludingWhere<Jobs>
  ): Promise<{ data: Jobs, matchScore: number | null, isSaved: boolean, apiDurations: { endpoint: string; duration: string } | null }> {
    const job = await this.jobsRepository.findById(id, filter);

    // current User profile
    let currentUser: any = null;
    const authHeader = request.headers.authorization;
    const requestId = request.headers['X-Request-Id'] || await this.requestIdService.createRequestId();
    console.log('Request ID:', requestId);

    if (authHeader && authHeader !== '' && authHeader !== null && authHeader !== undefined && authHeader !== 'Bearer') {
      currentUser = await this.validateCredentials(authHeader);
    }

    let user: any = null;
    let resume: any = null;

    if (currentUser) {
      user = await this.userRepository.findById(currentUser.id);
      resume = await this.resumeRepository.findOne({ where: { userId: user.id } });
    }

    if (job && user && resume) {
      const apiData = {
        resume_id: resume?.id?.toString(),
        job_id: job?.id?.toString(),
        job_boost: false
      };

      console.log(`${process.env.SERVER_URL}/api/job_boost/job_match_insights`);
      const apiResponse: any = await apiClient.post(`${process.env.SERVER_URL}/api/job_boost/job_match_insights`,
        apiData,
        {
          headers: {
            "X-apiKey": process.env.X_API_KEY || '',
            "X-Request-Id": requestId.toString()
          }
        }
      );
      const { duration } = apiResponse;
      console.log('Response time for => /api/job_boost/job_match_insights :', duration)

      const savedJob = await this.savedJobsUsersLinkRepository.findOne({
        where: { and: [{ jobsId: job.id }, { userId: user.id }] },
      });

      if (apiResponse.data) {
        return {
          data: job,
          matchScore: apiResponse?.data?.match_score,
          isSaved: !!savedJob,
          apiDurations: {
            endpoint: '/api/job_boost/job_match_insights',
            duration
          }
        }
      } else {
        return {
          data: job,
          matchScore: null,
          isSaved: !!savedJob,
          apiDurations: {
            endpoint: '/api/job_boost/job_match_insights',
            duration
          }
        }
      }
    }

    return {
      data: job,
      matchScore: null,
      isSaved: false,
      apiDurations: null
    }
  }

  // @patch('/jobs/{id}')
  // @response(204, {
  //   description: 'Jobs PATCH success',
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Jobs, { partial: true }),
  //       },
  //     },
  //   })
  //   jobs: Jobs,
  // ): Promise<void> {
  //   await this.jobsRepository.updateById(id, jobs);
  // }

  // @put('/jobs/{id}')
  // @response(204, {
  //   description: 'Jobs PUT success',
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() jobs: Jobs,
  // ): Promise<void> {
  //   await this.jobsRepository.replaceById(id, jobs);
  // }

  @del('/jobs/{id}')
  @response(204, {
    description: 'Jobs DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.jobsRepository.deleteById(id);
  }

  // similar jobs
  @post('/jobs/similar-jobs')
  async fetchSimilarJobs(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              jobId: {
                type: 'number',
              },
              limit: {
                type: 'number'
              },
            }
          }
        }
      }
    })
    data: {
      jobId: number;
      limit: number;
    }
  ): Promise<{ success: boolean; message: string; data: Jobs[]; apiDurations: { endpoint: string; duration: string } | null }> {

    const requestId = request.headers['X-Request-Id'] || await this.requestIdService.createRequestId();
    console.log('Request ID:', requestId);

    try {
      const job = await this.jobsRepository.findById(data.jobId);

      if (!job) {
        throw new HttpErrors.NotFound(`Job with Id ${data.jobId} not found`);
      }

      const apiData = {
        jd_id: job?.id?.toString(),
        limit: data.limit ? data.limit : 10
      };

      const apiResponse: any = await apiClient.post(`${process.env.SERVER_URL}/api/jd/similar_jobs`,
        apiData,
        {
          headers: {
            "X-apiKey": process.env.X_API_KEY || '',
            "X-Request-Id": requestId.toString()
          }
        }
      );

      const { duration } = apiResponse;
      console.log('Response time for => /api/jd/similar_jobs :', duration)

      if (apiResponse && apiResponse.data) {
        const similarJobsIds = apiResponse.data.similar_job_ids ? apiResponse.data.similar_job_ids : [];
        const jobs = await this.jobsRepository.find({ where: { id: { inq: similarJobsIds } } });

        return {
          success: true,
          message: "Similar jobs",
          data: jobs,
          apiDurations: {
            endpoint: '/api/jd/similar_jobs',
            duration
          }
        }
      }

      return {
        success: false,
        message: "Failed to get similar jobs",
        data: [],
        apiDurations: {
          endpoint: '/api/jd/similar_jobs',
          duration
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // job-boost-insights
  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  // })
  @post('/jobs/job-boost')
  async getJobBoostData(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              jobId: {
                type: 'number',
              },
              resumeId: {
                type: 'number',
              }
            }
          }
        }
      }
    })
    data: {
      jobId: number;
      resumeId: number;
    }
  ): Promise<{ success: boolean; message: string; data: object | null, apiDurations: { endpoint: string; duration: string } | null }> {
    const requestId = request.headers['X-Request-Id'] || await this.requestIdService.createRequestId();
    console.log('Request ID:', requestId);

    try {
      const job = await this.jobsRepository.findById(data.jobId);

      if (!job) {
        throw new HttpErrors[404](`Job not found with Id ${data.jobId}`);
      }

      const resume = await this.resumeRepository.findById(data.resumeId);

      if (!resume) {
        throw new HttpErrors[404](`Resume not found with Id ${data.resumeId}`);
      }

      // if (resume && resume.userId !== Number(currentUser.id)) {
      //   throw new HttpErrors.Unauthorized(`Given Resume Id is not of login user`);
      // }

      if (job && resume) {
        const apiData = {
          resume_id: resume?.id?.toString(),
          job_id: job?.id?.toString(),
          job_boost: true
        }

        const apiResponse: any = await apiClient.post(`${process.env.SERVER_URL}/api/job_boost/job_match_insights`,
          apiData,
          {
            headers: {
              "X-apiKey": process.env.X_API_KEY || '',
              "X-Request-Id": requestId.toString()
            }
          }
        );
        const { duration } = apiResponse;
        console.log('Response time for => /api/job_boost/job_match_insights :', duration)

        if (apiResponse.data) {
          return {
            success: true,
            message: "Job boost data",
            data: apiResponse.data,
            apiDurations: {
              endpoint: 'api/job_boost/job_match_insights',
              duration
            }
          }
        } else {
          return {
            success: false,
            message: "Failed to get job boost data",
            data: null,
            apiDurations: {
              endpoint: 'api/job_boost/job_match_insights',
              duration
            }
          }
        }
      }

      return {
        success: false,
        message: "Failed to get job boost data",
        data: null,
        apiDurations: null
      }
    } catch (error) {
      throw error;
    }
  }

  // job-boost-company-statistical-data
  // @authenticate({
  //   strategy: 'jwt',
  //   options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  // })
  @post('/jobs/job-boost-statistical-data/{id}')
  async fetchJobBoostStatisticalData(
    @inject(RestBindings.Http.REQUEST) request: Request,
    @param.path.number('id') jobId: number,
  ): Promise<{ success: boolean; message: string; data: object | null; apiDurations: { endpoint: string; duration: string } | null }> {
    const requestId = request.headers['X-Request-Id'] || await this.requestIdService.createRequestId();
    console.log('Request ID:', requestId);

    try {
      const job = await this.jobsRepository.findById(jobId);

      if (!job) {
        throw new HttpErrors[404](`Job with Id ${jobId} not found`);
      }

      const apiData = {
        job_title: job.jobTitle,
        company_name: job.company
      }
      console.log('apiData', apiData);
      const apiResponse: any = await apiClient.post(`${process.env.SERVER_URL}/api/job_boost/company_benchmark`,
        apiData,
        {
          headers: {
            "X-apiKey": process.env.X_API_KEY || '',
            "X-Request-Id": requestId.toString()
          }
        }
      );
      const { duration } = apiResponse;
      console.log('Response time for => /api/job_boost/company_benchmark :', duration)

      console.log('apiResponse', apiResponse);

      if (apiResponse.data) {
        return {
          success: true,
          message: "Job boost statistical data",
          data: apiResponse.data,
          apiDurations: {
            endpoint: '/api/job_boost/company_benchmark',
            duration
          }
        }
      }

      return {
        success: false,
        message: "Failed to get job boost statistical data",
        data: null,
        apiDurations: {
          endpoint: '/api/job_boost/company_benchmark',
          duration
        }
      }
    } catch (error) {
      console.log('error while fetching statistical data: ', error);
      throw error;
    }
  }

  // saved job
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/save-job/{id}')
  async saveJob(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') jobId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const job = await this.jobsRepository.findById(jobId);
      if (!job) {
        throw new HttpErrors.NotFound(`Job with Id ${jobId} not found`);
      }

      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const existingLink = await this.savedJobsUsersLinkRepository.findOne({
        where: { userId: user.id, jobsId: jobId },
      });

      if (existingLink) {
        // toggle saved flag
        await this.savedJobsUsersLinkRepository.updateById(existingLink.id, {
          isSaved: !existingLink.isSaved,
          updatedAt: new Date(),
        });
        return { success: true, message: existingLink.isSaved ? 'Job unsaved successfully' : 'Job saved successfully' };
      } else {
        await this.savedJobsUsersLinkRepository.create({
          userId: user.id,
          jobsId: jobId,
          isSaved: true,
          isApplied: false,
        });
        return { success: true, message: 'Job saved successfully' };
      }
    } catch (error) {
      throw error;
    }
  }

  // applied job
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/apply-job/{id}')
  async appliedJob(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') jobId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const job = await this.jobsRepository.findById(jobId);
      if (!job) {
        throw new HttpErrors.NotFound(`Job with Id ${jobId} not found`);
      }

      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const existingLink = await this.savedJobsUsersLinkRepository.findOne({
        where: { userId: user.id, jobsId: jobId },
      });

      if (existingLink) {
        if (existingLink.isApplied) {
          return { success: false, message: 'Already applied to this job' };
        }
        await this.savedJobsUsersLinkRepository.updateById(existingLink.id, {
          isApplied: true,
          updatedAt: new Date(),
        });
        return { success: true, message: 'Job applied successfully' };
      } else {
        await this.savedJobsUsersLinkRepository.create({
          userId: user.id,
          jobsId: jobId,
          isSaved: false,
          isApplied: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true, message: 'Job applied successfully' };
      }
    } catch (error) {
      throw error;
    }
  }

  // saved jobs
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/saved-jobs')
  async getSavedJobs(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<{ success: boolean; message: string; savedJobs: object[] }> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const links = await this.savedJobsUsersLinkRepository.find({
        where: { userId: user.id, isSaved: true },
      });

      const jobs: object[] = [];
      for (const link of links) {
        const job = await this.jobsRepository.findById(link.jobsId);
        jobs.push({
          ...job,
          isSaved: link.isSaved,
          isApplied: link.isApplied,
        });
      }

      return { success: true, message: 'Saved jobs', savedJobs: jobs };
    } catch (error) {
      throw error;
    }
  }

  // applied jobs
  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @post('/jobs/applied-jobs')
  async getAppliedJobs(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<{ success: boolean; message: string; appliedJobs: object[] }> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.NotFound(`User with Id ${currentUser.id} not found`);
      }

      const links = await this.savedJobsUsersLinkRepository.find({
        where: { userId: user.id, isApplied: true },
      });

      const jobs: object[] = [];
      for (const link of links) {
        const job = await this.jobsRepository.findById(link.jobsId);
        jobs.push({
          ...job,
          isSaved: link.isSaved,
          isApplied: link.isApplied,
        });
      }

      return { success: true, message: 'Applied jobs', appliedJobs: jobs };
    } catch (error) {
      throw error;
    }
  }
}
