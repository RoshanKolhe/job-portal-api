import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { HttpErrors, post, requestBody } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import { JobPortalDataSource } from '../datasources';
import { STORAGE_DIRECTORY } from '../keys';
import {
  ProfileAnalyticsRepository,
  ResumeRepository,
  UserRepository,
} from '../repositories';
import { EventHistoryService } from '../services/event-history.service';

export class ProfileAnalyticsController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
    @repository(ProfileAnalyticsRepository)
    public profileAnalyticsRepository: ProfileAnalyticsRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(ResumeRepository)
    public resumeRepository: ResumeRepository,
    @inject('service.eventhistory.service')
    public eventHistoryService: EventHistoryService,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) { }

  // @authenticate('jwt')
  @post('/profile-analytics')
  async getProfileAnalytics(
    // @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              resumeId: {
                type: 'number',
              },
              linkedInUrl: {
                type: 'string'
              },
              viewDetails: {
                type: 'boolean'
              },
              smartInsights: {
                type: 'boolean'
              }
            },
          },
        },
      },
    })
    requestBody: {
      resumeId: number;
      linkedInUrl: string;
      viewDetails: boolean;
      smartInsights: boolean;
    },
  ): Promise<any> {
    try {
      const resume: any = await this.resumeRepository.findById(
        requestBody.resumeId,
      );

      if (!resume) {
        throw new HttpErrors.BadRequest('Resume Not found');
      }

      const analytics = await this.profileAnalyticsRepository.findOne({ where: { resumeId: resume.id } });

      if (analytics) {
        if (resume?.userId) {
          await this.eventHistoryService.addNewEvent(
            'FOBO score analysis',
            'FOBO score analysis done and updated existing in database',
            'Fobo-analysis-page',
            resume.userId
          );
        }

        const ProfileAnalyticsData = await this.profileAnalyticsRepository.findById(analytics.id, { include: [{ relation: 'user' }] });

        return {
          success: true,
          message: 'Updated Profile Analytics data',
          data: ProfileAnalyticsData
        };
      }

      const formData = new FormData();

      const filePath = this.validateFileName(resume.fileDetails.newFileName);
      const url: any = `${process.env.SERVER_URL}fobo`;
      if (!filePath) {
        throw new HttpErrors.NotFound('Resume Not Found');
      }
      formData.append('file', fs.createReadStream(filePath));
      formData.append('user_id', resume?.userId ? resume.userId : `1`);
      if (requestBody.linkedInUrl && requestBody.linkedInUrl !== '') {
        formData.append('linkedin_url', requestBody.linkedInUrl);
      }
      formData.append('X-apiKey', 2472118222258182);
      formData.append('short_task_description', String(requestBody.viewDetails));
      formData.append('use_resume', String(requestBody.smartInsights));

      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });

      if (response?.data?.status === 'success' && response?.data?.data) {
        const analyticsData = await this.profileAnalyticsRepository.create({
          resumeId: resume.id,
          relevant_job_class: response.data.data?.relevant_job_class,
          FOBO_Score: response.data.data?.FOBO_Score,
          Augmented_Score: response.data.data?.Augmented_Score,
          Augmentation_Comment: response.data.data?.Augmentation_Comment,
          Automated_Score: response.data.data?.Automated_Score,
          Automated_Comment: response.data.data?.Automated_Comment,
          Human_Score: response.data.data?.Human_Score,
          Human_Comment: response.data.data?.Human_Comment,
          Comment: response.data.data?.Comment,
          Strategy: response.data.data?.Strategy,
          Task_Distribution_Automation: response.data.data?.Task_Distribution_Automation,
          Task_Distribution_Human: response.data.data?.Task_Distribution_Human,
          Task_Distribution_Augmentation: response.data.data?.Task_Distribution_Augmentation,
        });

        await this.eventHistoryService.addNewEvent(
          'FOBO score analysis',
          'FOBO score analysis done and created new in database',
          'Fobo-analysis-page',
          resume.userId
        );

        const finalAnalyticsData = await this.profileAnalyticsRepository.findById(analyticsData.id, { include: [{ relation: 'user' }] });

        return {
          success: true,
          message: 'New Profile Analytics data',
          data: finalAnalyticsData
        };
      }

      if (response?.data?.status === 'error' && response?.data?.data === null) {
        throw new HttpErrors[500];
      }

    } catch (error) {
      console.log('error while getting analytics', error);
      const analyticsRepository: any = await this.profileAnalyticsRepository.findOne({ where: { resumeId: requestBody.resumeId }, include: [{ relation: 'user' }] });
      if (analyticsRepository?.resume?.userId) {
        await this.eventHistoryService.addNewEvent(
          'FOBO score analysis',
          'Returning old FOBO score from database',
          'Fobo-analysis-page',
          analyticsRepository?.resume?.userId
        );
      }
      if (analyticsRepository) {
        return {
          success: true,
          message: "old analytics data",
          data: analyticsRepository
        };
      }else{
        throw new HttpErrors.BadGateway('Something went wrong');
      }
    }
  }

  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }

  // API for last FOBO analytics
  @authenticate({ strategy: 'jwt' })
  @post('/last-fobo-score/')
  async fetchLastFoboScore(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resumeIds: {
                type: 'array',
                items: { type: 'number' },
              },
            },
            required: ['resumeIds'],
          },
        },
      },
    })
    requestBody: {
      resumeIds: number[];
    }
  ): Promise<{ success: boolean; message: string; analytics: object | null }> {
    try {
      const { resumeIds } = requestBody;

      if (!resumeIds || resumeIds.length === 0) {
        return {
          success: false,
          message: 'No resumeIds provided',
          analytics: null,
        };
      }

      // Fetch all analytics entries for given resumeIds
      const analytics = await this.profileAnalyticsRepository.find({
        where: {
          resumeId: { inq: resumeIds },
        },
        order: ['createdAt DESC'], // Ensure ordering from newest to oldest
      });

      if (!analytics || analytics.length === 0) {
        return {
          success: false,
          message: 'No analytics found for provided resumeIds',
          analytics: null,
        };
      }

      // Return only the latest one (first after DESC sort)
      return {
        success: true,
        message: 'Last FOBO score fetched successfully',
        analytics: analytics[0], // most recent
      };
    } catch (error) {
      throw error;
    }
  }
}