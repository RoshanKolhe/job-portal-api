import { get, HttpErrors, post, requestBody } from "@loopback/rest";
import axios from "axios";
import FormData from "form-data";

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
  ): Promise<{ success: boolean; message: string; data: object | null }> {
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
        const apiResponse = await axios.post(`${process.env.SERVER_URL}/api/career_path_match`,
          apiData,
          {
            headers: {
              "X-apiKey": "2472118222258182",
            }
          }
        );

        console.log('api response', apiResponse);
        if (apiResponse?.data?.data) {
          return {
            success: true,
            message: "Career compass data",
            data: {
              currentRole: apiResponse?.data?.data?.current_role,
              levels: apiResponse?.data?.data?.levels
            }
          }
        } else {
          return {
            success: false,
            message: "Career compass data not found",
            data: null
          }
        }
      }

      const apiData = {
        current_designation: designation,
        experience_in_years: experience
      };

      const apiResponse = await axios.post(`${process.env.SERVER_URL}/api/career_path_match`,
        apiData,
        {
          headers: {
            "X-apiKey": "2472118222258182",
          }
        }
      );

      console.log('apiresopnse', apiResponse);

      if (apiResponse?.data?.data) {
        return {
          success: true,
          message: "Career compass data",
          data: {
            currentRole: apiResponse?.data?.data?.current_role,
            levels: apiResponse?.data?.data?.levels
          }
        }
      } else {
        return {
          success: false,
          message: "Career compass data not found",
          data: null
        }
      }

    } catch (error) {
      throw error;
    }
  }

  @get('/carrer-compass/roles')
  async getRoles(): Promise<{ success: boolean; message: string; roles: string[] }> {
    try {
      const apiResponse = await axios.get(`${process.env.SERVER_URL}/api/knowledge-graph/roles`,
        {
          headers: {
            "X-apiKey": "2472118222258182",
          }
        }
      );

      if (apiResponse?.data.length > 0) {
        return {
          success: true,
          message: "Roles data",
          roles: apiResponse?.data
        }
      }

      return {
        success: false,
        message: "Roles data not found",
        roles: []
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
      const apiResponse = await axios.post(
        'http://164.52.221.77:7483/fobo/company',
        form,
        {
          headers: {
            ...form.getHeaders(),
            "X-apiKey": "2472118222258182",
          }
        }
      );

      // Standardized response
      if (apiResponse?.data?.data) {
        return {
          success: true,
          message: 'Company fobo data',
          data: apiResponse?.data?.data,
        };
      }

      return {
        success: false,
        message: 'company fobo data not found',
        data: null,
      };

    } catch (error) {
      console.error('❌ Error while generating company FOBO:', error);
      throw new HttpErrors.InternalServerError('FOBO API failed');
    }
  }
}
