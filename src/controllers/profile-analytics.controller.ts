import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import {JobPortalDataSource} from '../datasources';
import {STORAGE_DIRECTORY} from '../keys';
import {
  ProfileAnalyticsRepository,
  ResumeRepository,
  UserRepository,
} from '../repositories';

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
    @inject(STORAGE_DIRECTORY) private storageDirectory: string,
  ) {}

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
    },
  ): Promise<any> {
    try {
      const resume:any = await this.resumeRepository.findById(
        requestBody.resumeId,
      );

      if (!resume) {
        throw new HttpErrors.BadRequest('Resume Not found');
      }

      // let res: any;
      // let res: any;
      const formData = new FormData();

      const filePath = this.validateFileName(resume.fileDetails.newFileName);
      const url: any = `${process.env.SERVER_URL}fobo`;
      if (!filePath) {
        throw new HttpErrors.NotFound('Resume Not Found');
      }
      formData.append('file', fs.createReadStream(filePath));
      formData.append('user_id', `1`);
      if(requestBody.linkedInUrl && requestBody.linkedInUrl !== ''){
        formData.append('linkedin_url', requestBody.linkedInUrl);
      }
      formData.append('X-apiKey', 2472118222258182);
      formData.append('short_task_description', String(requestBody.viewDetails));

      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });

      const analytics = await this.profileAnalyticsRepository.findOne({where : {resumeId : resume.id}});

      if(analytics){
        await this.profileAnalyticsRepository.updateById(analytics.id, {
          ...analytics,
          resumeId: resume.id,
          userId: resume.userId,
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

        if(response.data.data?.user_id){
          await this.userRepository.updateById(Number(response.data.data?.user_id),{profileDescription: response.data.data?.Profile_summary});
        }
        
        const ProfileAnalyticsData = await this.profileAnalyticsRepository.findById(analytics.id, {include : [{relation : 'user'}]});
        return {
          success: true,
          message: 'Updated Profile Analytics data',
          data: ProfileAnalyticsData
        };
      }

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

      const finalAnalyticsData = await this.profileAnalyticsRepository.findById(analyticsData.id, {include : [{relation : 'user'}]});

       return {
        success: true,
        message: 'New Profile Analytics data',
        data: finalAnalyticsData
      };
    } catch (error) {
      console.log('error while getting analytics', error);
      const analyticsRepository = await this.profileAnalyticsRepository.findOne({where : {resumeId : requestBody.resumeId}, include : [{relation : 'user'}]});
      if(analyticsRepository){
        return {
          success: true,
          message: "old analytics data",
          data: analyticsRepository
        };
      }
      return{
        success: false,
        message: 'No data found'
      }
    }
  }
  
  private validateFileName(fileName: string) {
    const resolved = path.resolve(this.storageDirectory, fileName);
    if (resolved.startsWith(this.storageDirectory)) return resolved;
    // The resolved file is outside sandbox
    throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
  }
}

//code for the data validation
//    const existingData = await this.profileAnalyticsRepository.findOne({
//   where:{resumeId: resume.id , userId: user.id}
// })
// if(existingData){
//   console.log('Retrun Previous Save Data');
//   return existingData;
// }else{
//   throw new HttpErrors.NotFound('For Given ResumeId Data Will Not Found');
// }
