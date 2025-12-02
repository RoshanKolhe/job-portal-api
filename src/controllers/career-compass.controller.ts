import { get, HttpErrors, post, requestBody } from "@loopback/rest";
import axios from "axios";
import FormData from "form-data";
import apiClient from '../interceptors/axios-client.interceptor';

export class CareerCompassController {
  constructor() { }

  // career compass api
  @post('/career-compass')
  async fetchCareerCompass(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              resumeId: {
                type: 'number',
              },
              designation: {
                type: 'string'
              },
              experience: {
                type: 'number'
              }
            }
          }
        }
      }
    })
    data: {
      resumeId?: number;
      designation?: string;
      experience?: number
    }
  ): Promise<{ success: boolean; message: string; data: object | null; apiDurations: { endpoint: string; duration: string } }> {
    try {
      const { resumeId, designation, experience } = data;

      if (!resumeId && !designation && !experience) {
        throw new HttpErrors.BadRequest('Invalid request body');
      }

      if (!resumeId && (!designation || !experience)) {
        throw new HttpErrors[422]('Fields are missing');
      }

      if (resumeId) {
        const apiData = {
          resume_id: resumeId?.toString(),
        };

        console.log('api data', apiData);
        const apiResponse: any = await apiClient.post(`${process.env.SERVER_URL}/api/career_path_match`,
          apiData,
          {
            headers: {
              "X-apiKey": "2472118222258182",
            }
          }
        );

        const { duration } = apiResponse;
        console.log('Response time for => /api/career_path_match :', duration)

        console.log('api response', apiResponse);
        if (apiResponse?.data?.data) {
          return {
            success: true,
            message: "Career compass data",
            data: {
              currentRole: apiResponse?.data?.data?.current_role,
              levels: apiResponse?.data?.data?.levels
            },
            apiDurations: {
              endpoint: '/api/career_path_match',
              duration
            }
          }
        } else {
          return {
            success: false,
            message: "Career compass data not found",
            data: null,
            apiDurations: {
              endpoint: '/api/career_path_match',
              duration
            }
          }
        }
      }

      const apiData = {
        current_designation: designation,
        experience_in_years: experience
      };

      const apiResponse: any = await apiClient.post(`${process.env.SERVER_URL}/api/career_path_match`,
        apiData,
        {
          headers: {
            "X-apiKey": "2472118222258182",
          }
        }
      );
      const { duration } = apiResponse;
      console.log('Response time for => /api/career_path_match :', duration)

      console.log('apiresopnse', apiResponse);

      if (apiResponse?.data?.data) {
        return {
          success: true,
          message: "Career compass data",
          data: {
            currentRole: apiResponse?.data?.data?.current_role,
            levels: apiResponse?.data?.data?.levels
          },
          apiDurations: {
            endpoint: '/api/career_path_match',
            duration
          }
        }
      } else {
        return {
          success: false,
          message: "Career compass data not found",
          data: null,
          apiDurations: {
            endpoint: '/api/career_path_match',
            duration
          }
        }
      }

    } catch (error) {
      throw error;
    }
  }

  @get('/carrer-compass/roles')
  async getRoles(): Promise<{ success: boolean; message: string; roles: string[]; apiDurations: { endpoint: string; duration: string } }> {
    try {
      const apiResponse: any = await apiClient.get(`${process.env.SERVER_URL}/api/knowledge-graph/roles`,
        {
          headers: {
            "X-apiKey": "2472118222258182",
          }
        }
      );

      const { duration } = apiResponse;
      console.log('Response time for => /api/knowledge-graph/roles :', duration)

      if (apiResponse?.data.length > 0) {
        return {
          success: true,
          message: "Roles data",
          roles: apiResponse?.data,
          apiDurations: {
            endpoint: '/api/knowledge-graph/roles',
            duration: duration
          }
        }
      }

      return {
        success: false,
        message: "Roles data not found",
        roles: [],
        apiDurations: {
          endpoint: '/api/knowledge-graph/roles',
          duration: duration
        }
      }
    } catch (error) {
      console.log('Error while sending the roles: ', error);
      throw error;
    }
  }


  // company-fobo
  @post('/company-fobo')
  async getCompanyFobo(
    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['company_name'],
            properties: {
              companyName: { type: 'string' },
              maxProfilesPerLevel: { type: 'number' },
              skipMissing: { type: 'boolean' },
            },
          },
        },
      },
    })
    body: {
      companyName: string;
      maxProfilesPerLevel?: number;
      skipMissing?: boolean;
    }
  ) {
    try {
      const form = new FormData();
      form.append('company_name', body.companyName);
      form.append('max_profiles_per_level', body.maxProfilesPerLevel?.toString() || '4');
      form.append('skip_missing', body.skipMissing?.toString() || 'true');

      console.log("➡️ External API FormData:", body);

      // Send request to external FOBO API
      const apiResponse: any = await apiClient.post(
        'http://164.52.221.77:7483/fobo/company',
        form,
        {
          headers: {
            ...form.getHeaders(),
            "X-apiKey": "2472118222258182",
          }
        }
      );

      const { duration } = apiResponse;

      // Standardized response
      if (apiResponse?.data?.data) {
        return {
          success: true,
          message: 'Company fobo data',
          data: apiResponse?.data?.data,
          apiDurations: {
            endpoint: '/fobo/company',
            duration
          }
        };
      }

      return {
        success: false,
        message: 'company fobo data not found',
        data: null,
        apiDurations: {
          endpoint: '/fobo/company',
          duration
        }
      };

    } catch (error) {
      console.error('❌ Error while generating company FOBO:', error);
      throw new HttpErrors.InternalServerError('FOBO API failed');
    }
  }
}
