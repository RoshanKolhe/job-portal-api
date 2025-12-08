import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { repository } from '@loopback/repository';
import { get, HttpErrors, param, post, requestBody } from '@loopback/rest';
import path from 'path';
import { JobPortalDataSource } from '../datasources';
import { STORAGE_DIRECTORY } from '../keys';
import {
  ProfileAnalyticsRepository,
  ResumeRepository,
  UserRepository,
} from '../repositories';
import { EventHistoryService } from '../services/event-history.service';
import { FOBOService } from '../services/fobo.service';

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
    @inject('service.foboService.service')
    private foboService: FOBOService,
    @inject('service.eventhistory.service')
    public eventHistoryService: EventHistoryService,
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) { }

  // @authenticate('jwt')
  @post('/profile-analytics')
  async getProfileAnalytics(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              resumeId: { type: 'number' },
              linkedInUrl: { type: 'string' },
              viewDetails: { type: 'boolean' },
              smartInsights: { type: 'boolean' },
              isFoboPro: { type: 'boolean' },
              isComprehensiveMode: { type: 'boolean' },
              isSubscribed: { type: 'boolean' },
            },
            required: [],
          },
        },
      },
    })
    requestBody: {
      resumeId?: number;
      linkedInUrl?: string;
      viewDetails: boolean;
      smartInsights: boolean;
      isFoboPro?: boolean;
      isComprehensiveMode?: boolean;
      isSubscribed?: boolean;
    },
  ): Promise<any> {
    try {
      let resume: any = null;

      if (requestBody.resumeId) {
        resume = await this.resumeRepository.findById(requestBody.resumeId);
      }

      let fields: { [key: string]: boolean } = {
        analysis: false,
        skill_erosion_analysis: false,
        json_schema_date: false,
        json_file_url: false,
        markdown_file_url: false,
        comprehensive_analysis: false,
      };

      if (requestBody.isFoboPro) {
        fields = {
          json_schema_date: false,
          json_file_url: false,
          markdown_file_url: false,
          comprehensive_analysis: false,
        }
      }

      if (requestBody.isComprehensiveMode) {
        fields = {};
      }

      if (requestBody.isFoboPro && !requestBody.isSubscribed) {
        fields = {
          FOBO_Score: true,
          AI_Readiness_Score: true,
          automation_potential: true,
          strategic_objective_count: true,
          transformation_timeline: true,
          relevant_job_class: true,
          json_schema_data: true
        };
      }

      const isFoboPro = requestBody.isFoboPro ?? false;
      const analytics = await this.profileAnalyticsRepository.findOne({
        where: {
          and: [
            {
              or: [
                { ...(requestBody.resumeId ? { resumeId: requestBody.resumeId } : {}) },
                { ...(requestBody.linkedInUrl ? { linkedInUrl: requestBody.linkedInUrl } : {}) },
              ]
            },
            { isFoboPro: isFoboPro }
          ]
        }
      });

      if (analytics) {
        if (resume?.userId) {
          await this.eventHistoryService.addNewEvent(
            'FOBO score analysis',
            'FOBO score analysis done and updated existing in database',
            'Fobo-analysis-page',
            resume.userId
          );
        }

        const profileAnalyticsData = await this.profileAnalyticsRepository.findById(
          analytics.id,
          { include: [{ relation: 'user' }], fields: fields },
        );

        return {
          success: true,
          message: 'Updated Profile Analytics data',
          data: profileAnalyticsData,
        };
      }

      if (requestBody.resumeId) {
        const foboResponse = await this.foboService.getFoboData(requestBody.resumeId, requestBody);

        if (foboResponse.success && foboResponse.analytics) {
          return {
            success: true,
            message: 'Updated Profile Analytics data',
            data: foboResponse.analytics,
          };
        }

        return {
          success: true,
          message: 'Updated Profile Analytics data',
          data: foboResponse,
        };
      }
    } catch (error) {
      console.log('error while getting analytics', error);

      const analyticsFallback: any = await this.profileAnalyticsRepository.findOne({
        where: {
          ...(requestBody.resumeId ? { resumeId: requestBody.resumeId } : {}),
          ...(requestBody.linkedInUrl ? { linkedInUrl: requestBody.linkedInUrl } : {}),
        },
        include: [{ relation: 'user' }, { relation: 'resume' }],
      });

      if (analyticsFallback) {
        if (analyticsFallback?.resumeId && analyticsFallback?.resume?.userId) {
          await this.eventHistoryService.addNewEvent(
            'FOBO score analysis',
            'Returning old FOBO score from database',
            'Fobo-analysis-page',
            analyticsFallback.resume.userId
          );
        }

        return {
          success: true,
          message: 'Old analytics data',
          data: analyticsFallback,
          apiDurations: null
        };
      } else {
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
              linkedInUrl: {
                type: 'string'
              }
            },
            required: [],
          },
        },
      },
    })
    requestBody: {
      resumeIds?: number[];
      linkedInUrl?: string;
    }
  ): Promise<{ success: boolean; message: string; analytics: object | null }> {
    try {
      const { resumeIds, linkedInUrl } = requestBody;

      if ((!resumeIds || resumeIds?.length === 0) && !linkedInUrl) {
        return {
          success: false,
          message: 'No resumeIds and linkedIn Url provided',
          analytics: null,
        };
      }

      const orConditions = [];

      if (resumeIds && resumeIds.length > 0) {
        orConditions.push({ resumeId: { inq: resumeIds } });
      }

      if (linkedInUrl) {
        orConditions.push({ linkedInUrl: linkedInUrl });
      }

      const analytics = await this.profileAnalyticsRepository.find({
        where: {
          or: orConditions,
        },
        order: ['createdAt DESC'],
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

  async returnPartialFoboProData(resumeId: number) {
    const fields = {
      FOBO_Score: true,
      AI_Readiness_Score: true,
      automation_potential: true,
      strategic_objective_count: true,
      transformation_timeline: true,
      relevant_job_class: true,
      json_schema_data: true
    };

    const analytics = await this.profileAnalyticsRepository.findOne({
      where: {
        and: [
          { resumeId: resumeId },
          { isFoboPro: true }
        ]
      },
      fields
    });

    return{
      success: true,
      message: "fobo pro data",
      analytics
    }
  }

  @authenticate({ strategy: 'jwt' })
  @get('/last-fobo-pro-score/{resumeId}')
  async getProcessesFoboScore(
    @param.path.number('resumeId') resumeId: number
  ) {
    const runningAnalytics = await this.foboService.getRunningAnalytics(resumeId, true);

    if (!runningAnalytics) {
      return {
        success: false,
        message: "No analytics found for provided resumeId.",
        analytics: null,
      };
    }

    switch (runningAnalytics.status) {
      case 0:
        return {
          success: false,
          message: 'Generating... Please check in some time',
          analytics: null,
        };

      case 1:
        return {
          success: false,
          message: 'Generating... Please check in some time',
          analytics: null,
        };

      case 2:
        const response = await this.returnPartialFoboProData(resumeId);
        return response;

      case 3:
        return {
          success: false,
          message:
            "Your score could not be calculated due to a processing issue. We will manually reprocess your resume and revert to you within 3–4 hours with a resolution.",
          analytics: null,
        };

      default:
        return {
          success: false,
          message: "Invalid analytics status.",
          analytics: null,
        };
    }
  }
}
