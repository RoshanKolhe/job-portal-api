import {inject} from '@loopback/core';
import {get, Request, Response, RestBindings} from '@loopback/rest';
import passport from 'passport';
import {LinkedinAuthService} from '../services/linkedIn-auth.services';

export class LinkedinAuthController {
  constructor(
    @inject('service.linkedinAuth.service')
    public linkedinService: LinkedinAuthService, // ensures strategy is registered
  ) {}

  @get('/auth/linkedin')
  loginToLinkedin(
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ) {
    // Trigger LinkedIn OAuth login
    passport.authenticate('linkedin', {
      scope: ['openid', 'profile', 'email'],
    })(req, res);
  }

  
}
