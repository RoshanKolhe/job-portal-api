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

  @get('/auth/linkedin/callback')
  async linkedinCallback(
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      passport.authenticate(
        'linkedin',
        {session: false},
        (err: any, user: any, info: any) => {
          if (err || !user) {
            console.error('LinkedIn Auth Error:', err || info);
            res.redirect('http://localhost:4200/login-failed'); // Update to match your frontend
            return reject(err || new Error('Authentication failed'));
          }

          // Redirect to frontend with token
          res.redirect(
            `http://localhost:4200/success?token=${user.accessToken}`,
          );
          return resolve();
        },
      )(req, res);
    });
  }
}
