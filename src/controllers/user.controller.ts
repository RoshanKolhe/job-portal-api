/* eslint-disable @typescript-eslint/naming-convention */
import { AuthenticationBindings, authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';

import {
  DefaultTransactionalRepository,
  Filter,
  IsolationLevel,
  repository
} from '@loopback/repository';
import {
  HttpErrors,
  del,
  get,
  getJsonSchemaRef,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response
} from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import * as _ from 'lodash';
import { PermissionKeys } from '../authorization/permission-keys';
import { JobPortalDataSource } from '../datasources';
import { EmailManagerBindings } from '../keys';
import { User } from '../models';
import { Credentials, PlanRepository, UserRepository } from '../repositories';
import { EmailManager } from '../services/email.service';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { JWTService } from '../services/jwt-service';
import { MyUserService } from '../services/user-service';
import { validateCredentials } from '../services/validator';
import generateResetPasswordTemplate from '../templates/reset-password.template';
import SITE_SETTINGS from '../utils/config';
import { CredentialsRequestBody } from './specs/user-controller-spec';
import { EventHistoryService } from '../services/event-history.service';

export class UserController {
  constructor(
    @inject('datasources.job_portal')
    public dataSource: JobPortalDataSource,
    @inject(EmailManagerBindings.SEND_MAIL)
    public emailManager: EmailManager,
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(PlanRepository)
    public planRepository: PlanRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher,
    @inject('service.user.service')
    public userService: MyUserService,
    @inject('service.jwt.service')
    public jwtService: JWTService,
    @inject('service.eventhistory.service')
    public eventHistoryService: EventHistoryService,
  ) { }

  @post('/register', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User),
        },
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            exclude: ['id'],
          }),
        },
      },
    })
    userData: Omit<User, 'id'>,
  ) {
    const repo = new DefaultTransactionalRepository(User, this.dataSource);
    const tx = await repo.beginTransaction(IsolationLevel.READ_COMMITTED);
    try {
      validateCredentials(userData);
      const user = await this.userRepository.findOne({
        where: {
          or: [{ email: userData.email }],
        },
      });
      if (user) {
        throw new HttpErrors.BadRequest('User Already Exists');
      }

      // userData.permissions = [PermissionKeys.ADMIN];
      userData.password = await this.hasher.hashPassword(userData.password);

      const plan = await this.planRepository.findOne({ where: { isFreePlan: true } });
      if (plan?.id) {
        const savedUser = await this.userRepository.create({ ...userData, currentPlanId: plan.id }, {
          transaction: tx,
        });
        const savedUserData = _.omit(savedUser, 'password');
        const userProfile = this.userService.convertToUserProfile(savedUser);
        const token = await this.jwtService.generateToken(userProfile);
        if (savedUser.id) {
          await this.eventHistoryService.addNewEvent(
            'registration',
            'registration of user done',
            'registration-page',
            savedUser.id
          );
        }
        tx.commit();
        return Promise.resolve({
          success: true,
          accessToken: token,
          userData: userData,
          message: `User registered successfully`,
        });
      } else {
        const savedUser = await this.userRepository.create(userData, {
          transaction: tx,
        });
        const savedUserData = _.omit(savedUser, 'password');
        const userProfile = this.userService.convertToUserProfile(savedUser);
        const token = await this.jwtService.generateToken(userProfile);
        if (savedUser.id) {
          await this.eventHistoryService.addNewEvent(
            'registration',
            'registration of user done',
            'registration-page',
            savedUser.id
          );
        }
        tx.commit();
        return Promise.resolve({
          success: true,
          accessToken: token,
          userData: userData,
          message: `User registered successfully`,
        });
      }
    } catch (err) {
      tx.rollback();
      throw err;
    }
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const userData = _.omit(user, 'password');
    const token = await this.jwtService.generateToken(userProfile);
    const allUserData = await this.userRepository.findById(userData.id);
    if (userData.id) {
      await this.eventHistoryService.addNewEvent(
        'login',
        'login of user done',
        'login-page',
        userData.id
      );
    }
    return Promise.resolve({
      accessToken: token,
      user: userData,
    });
  }

  @get('/me')
  @authenticate('jwt')
  async whoAmI(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<{}> {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUser.id,
      },
      include: [{ relation: 'resumes' }],
    });

    if (!user) {
      throw new HttpErrors.NotFound('User not found');
    }

    const userData = _.omit(user, 'password');

    return {
      ...userData,
      displayName: `${userData?.fullName}`,
    };
  }


  @authenticate({
    strategy: 'jwt',
    options: {
      required: [PermissionKeys.ADMIN],
    },
  })
  @get('/api/users/list')
  @response(200, {
    description: 'Array of Users model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    filter = {
      ...filter,
      where: {
        ...filter?.where,
        id: { neq: currentUser.id },
        isDeleted: false,
      },
      fields: { password: false, otp: false, otpExpireAt: false },
      // include: [
      //   {relation: 'creator'},
      //   {relation: 'updater'},
      //   {relation: 'department'},
      // ],
    };
    return this.userRepository.find(filter);
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN, PermissionKeys.CUSTOMER] },
  })
  @get('/api/users/{id}', {
    responses: {
      '200': {
        description: 'User Details',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getSingleUser(@param.path.number('id') id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      fields: {
        password: false,
        otp: false,
        otpExpireAt: false,
      },
    });
    return Promise.resolve({
      ...user,
    });
  }

  @authenticate({
    strategy: 'jwt',
  })
  @patch('/api/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, { partial: true }),
        },
      },
    })
    user: User,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<any> {
    // Fetch the user information before updating
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new HttpErrors.NotFound('User not found');
    }

    // Hash password if it's being updated
    if (user.password) {
      user.password = await this.hasher.hashPassword(user.password);
    }

    // Validate email uniqueness only if email is being updated
    if (user.email && user.email !== existingUser.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: user.email, id: { neq: id } }, // Exclude the current user
      });

      if (emailExists) {
        throw new HttpErrors.BadRequest('Email already exists');
      }
    }

    // Set updatedBy field
    // user.updatedBy = currentUser.id;

    await this.userRepository.updateById(id, user);

    const updatedUserData = await this.userRepository.findById(id);
    return {
      success: true,
      message: `User profile updated successfully`,
      data: updatedUserData
    };
  }

  // send reset link for password
  @post('/sendResetPasswordLink')
  async sendResetPasswordLink(
    @requestBody({
      description: 'Input for sending reset password link',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'The email address of the user',
              },
            },
            required: ['email'],
          },
        },
      },
    })
    userData: {
      email: string;
    },
  ): Promise<object> {
    const user = await this.userRepository.findOne({
      where: {
        email: userData.email,
      },
    });
    if (user) {
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generate10MinToken(userProfile);
      const resetPasswordLink = `${process.env.REACT_APP_SITE_URL}/auth/admin/new-password?token=${token}`;
      const template = generateResetPasswordTemplate({
        userData: userProfile,
        resetLink: resetPasswordLink,
      });
      console.log(template);
      const mailOptions = {
        from: SITE_SETTINGS.fromMail,
        to: userData.email,
        subject: template.subject,
        html: template.html,
      };

      try {
        await this.emailManager.sendMail(mailOptions);
        return {
          success: true,
          message: `Password reset link sent to ${userData.email}. Please check your inbox.`,
        };
      } catch (err) {
        throw new HttpErrors.UnprocessableEntity(
          err.message || 'Mail sending failed',
        );
      }
    } else {
      throw new HttpErrors.BadRequest("Email Doesn't Exist");
    }
  }

  @authenticate('jwt')
  @post('/setPassword')
  async setPassword(
    @requestBody({
      description: 'Input for changing user password',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              oldPassword: {
                type: 'string',
                description: "The user's current password",
              },
              newPassword: {
                type: 'string',
                description: 'The new password to be set',
              },
            },
            required: ['oldPassword', 'newPassword'],
          },
        },
      },
    })
    passwordOptions: any,
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
  ): Promise<object> {
    const user = await this.userRepository.findOne({
      where: {
        id: currentUser.id,
      },
    });

    if (user) {
      const passwordCheck = await this.hasher.comparePassword(
        passwordOptions.oldPassword,
        user.password,
      );

      if (passwordCheck) {
        const encryptedPassword = await this.hasher.hashPassword(
          passwordOptions.newPassword,
        );
        await this.userRepository.updateById(user.id, {
          password: encryptedPassword,
        });
        return {
          success: true,
          message: 'Password changed successfully',
        };
      } else {
        throw new HttpErrors.BadRequest("Old password doesn't match");
      }
    } else {
      throw new HttpErrors.BadRequest("Email doesn't exist");
    }
  }

  @authenticate('jwt')
  @post('/setNewPassword')
  async setNewPassword(
    @requestBody({
      description: 'Input for resetting user password without the old password',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
                description: 'The email address of the user',
              },
              newPassword: {
                type: 'string',
                description: 'The new password to be set',
              },
            },
            required: ['email', 'newPassword'], // Only email and newPassword are required
          },
        },
      },
    })
    passwordOptions: any,
  ): Promise<object> {
    console.log(passwordOptions);
    const user = await this.userRepository.findOne({
      where: {
        email: passwordOptions.email,
      },
    });

    if (user) {
      const encryptedPassword = await this.hasher.hashPassword(
        passwordOptions.newPassword,
      );
      await this.userRepository.updateById(user.id, {
        password: encryptedPassword,
      });
      return {
        success: true,
        message: 'Password updated successfully',
      };
    } else {
      throw new HttpErrors.BadRequest("Email doesn't exist");
    }
  }

  @authenticate({
    strategy: 'jwt',
    options: { required: [PermissionKeys.ADMIN] },
  })
  @del('/user/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(
    @inject(AuthenticationBindings.CURRENT_USER) currentUser: UserProfile,
    @param.path.number('id') id: number,
  ): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new HttpErrors.BadRequest('User Not Found');
    }

    await this.userRepository.updateById(id, {
      isDeleted: true,
      // deletedBy: currentUser.id,
      deletedAt: new Date(),
    });
  }

}

