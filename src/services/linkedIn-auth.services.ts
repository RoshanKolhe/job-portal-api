import {BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Request} from 'express';
import passport from 'passport';
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

import {PermissionKeys} from '../authorization/permission-keys';
import {UserRepository} from '../repositories';
import {JWTService} from './jwt-service';
import {MyUserService} from './user-service';

@injectable({scope: BindingScope.SINGLETON})
export class LinkedinAuthService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.jwt.service')
    public jwtService: JWTService,
    @inject('service.user.service')
    public userService: MyUserService,
  ) {
    this.configureLinkedinStrategy();
  }

  configureLinkedinStrategy() {
    passport.use(
      new LinkedInStrategy(
        {
          clientID: process.env.LINKEDIN_CLIENT_ID!,
          clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
          callbackURL: 'http://localhost:3000/auth/linkedin/callback',
          scope: ['openid', 'profile', 'email'],
          passReqToCallback: true,
        },
        async (
          req: Request,
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: Function,
        ) => {
          try {
            const email = profile.emails?.[0]?.value;
            const firstName = profile.displayName;

            if (!email) {
              return done(new Error('Email not provided by LinkedIn'), null);
            }

            let user = await this.userRepository.findOne({where: {email}});
            if (!user) {
              user = await this.userRepository.create({
                email,
                firstName,
                permissions: [PermissionKeys.CUSTOMER],
                isActive: true,
              });
            }

            const userProfile = this.userService.convertToUserProfile(user);
            const token = await this.jwtService.generateToken(userProfile);
            const fullUser = await this.userRepository.findById(user.id);

            return done(null, {
              accessToken: token,
              user: fullUser,
            });
          } catch (error) {
            return done(error, null);
          }
        },
      ),
    );
  }
}
