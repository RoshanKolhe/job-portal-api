import { repository } from "@loopback/repository";
import { UserRepository } from "../repositories";
import { authenticate, AuthenticationBindings } from "@loopback/authentication";
import { PermissionKeys } from "../authorization/permission-keys";
import { get, HttpErrors } from "@loopback/rest";
import { inject } from "@loopback/core";
import { UserProfile } from "@loopback/security";
import axios from "axios";

export class SsoController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  async retrieveAccessToken(): Promise<string> {
    try {
      const response = await axios.post(
        process.env.LEARNWORLDS_TOKEN_URL!,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: process.env.LEARNWORLDS_CLIENT_ID!,
          client_secret: process.env.LEARNWORLDS_CLIENT_SECRET!
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const data = response.data;
      const token = data?.access_token || data?.tokenData?.access_token;

      if (!token) {
        throw new Error('Access token not found in response');
      }

      return token;
    } catch (error) {
      console.error('Error retrieving access token:', error);
      throw error;
    }
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] }
  })
  @get('/sso/sso-login')
  async ssoLogin(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile
  ): Promise<any> {
    try {
      const user: any = await this.userRepository.findById(currentUser.id);

      if (!user) {
        throw new HttpErrors.BadRequest('User not found');
      }

      const payload: {
        email: string;
        username: string;
        redirectUrl: string;
        avatar?: string;
      } = {
        email: user.email,
        username: `${user.fullName}${user.id}`,
        redirectUrl: "https://altiv.learnworlds.com/courses"
      };

      if (user.avatar?.fileUrl) {
        payload.avatar = user.avatar.fileUrl;
      }

      const token = await this.retrieveAccessToken();

      console.log('token', token);

      const response = await axios.post(
        'https://altiv.learnworlds.com/admin/api/sso',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Lw-Client': process.env.LEARNWORLDS_CLIENT_ID!,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      return {...response.data, token};
    } catch (error) {
      console.error('SSO Login Error:', error);
      throw new HttpErrors.InternalServerError('Failed to generate SSO URL');
    }
  }
}
