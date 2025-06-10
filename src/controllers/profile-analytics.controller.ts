import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
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

  @authenticate('jwt')
  @post('/profile-analytics')
  async getProfileAnalytics(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              resumeId: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    requestBody: {
      resumeId: number;
    },
  ): Promise<any> {
    try {
      const user = await this.userRepository.findById(currentUser.id);
      if (!user) {
        throw new HttpErrors.BadRequest('User Not Found');
      }
      const resume: any = await this.resumeRepository.findById(
        requestBody.resumeId,
      );

      if (!resume) {
        throw new HttpErrors.BadRequest('Resume Not found');
      }
      // let res: any;
      const formData = new FormData();

      // const file = this.validateFileName(resume.fileDetails.newFileName);
      // console.log('file', file);
      // fs.readFile(resume.fileDetails.newFileName, function (err, data) {
      //   if (err) {
      //     console.log('errorrr');
      //     throw new HttpErrors.NotFound('File Not Found');
      //   }
      //   console.log('data', data);
      //   res = data;
      // });

      const filePath = this.validateFileName(resume.fileDetails.newFileName);
      const url: any = `${process.env.SERVER_URL}fobo`;
      if (!filePath) {
        throw new HttpErrors.NotFound('Resume Not Found');
      }
      formData.append('file', fs.createReadStream(filePath));
      formData.append('user_id', `${user.id}`);
      formData.append('X-apiKey', 2472118222258182);
      formData.append('short_task_description', 'true');

      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(), // VERY IMPORTANT!
      });

      const data = response.data.data;

      const profileAnalyticsData = {
        relevant_job_class: data.relevant_job_class,
        FOBO_Score: data.FOBO_Score,
        Augmented_Score: data.Augmented_Score,
        Augmentation_Comment: data.Augmentation_Comment,
        Automated_Score: data.Automated_Score,
        Automated_Comment: data.Automated_Comment,
        Human_Score: data.Human_Score,
        Human_Comment: data.Human_Comment,
        Comment: data.Comment,
        Strategy: data.Strategy,
        Task_Distribution_Automation: data.Task_Distribution_Automation,
        Task_Distribution_Human: data.Task_Distribution_Human,
        Task_Distribution_Augmentation: data.Task_Distribution_Augmentation,
        userId: user.id,
        resumeId: resume.id,
      };
      await this.profileAnalyticsRepository.create(profileAnalyticsData);

      return response.data;
    } catch (error) {
      throw error;
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
