import { HttpErrors, post, requestBody } from "@loopback/rest";
import axios from "axios";

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
          resume_id: resumeId,
        };

        const apiResponse = await axios.post(`${process.env.SERVER_URL}/api/career_path_match`,
          apiData,
          {
            headers: {
              "X-apiKey": "2472118222258182",
            }
          }
        );

        if (apiResponse.data) {
          return {
            success: true,
            message: "Career compass data",
            data: {
              currentRole: apiResponse?.data?.current_role,
              levels: apiResponse?.data?.levels
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

      if (apiResponse.data) {
        return {
          success: true,
          message: "Career compass data",
          data: {
            currentRole: apiResponse?.data?.current_role,
            levels: apiResponse?.data?.levels
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
  
}
