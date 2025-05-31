import {inject} from '@loopback/core';
import {get, Request, Response, RestBindings} from '@loopback/rest';
import {GoogleAuthService} from '../services/google-auth.service';

const passport = require('passport'); // Ensure this loads after the strategy is registered

export class GoogleAuthController {
  constructor(
    @inject('services.GoogleAuthService') // Note: fix the binding key (case-sensitive)
    public googleService: GoogleAuthService, // ensures strategy is configured
  ) {}

  @get('/auth/google', {
    responses: {
      '302': {
        description: 'Redirect to Google OAuth',
      },
    },
  })
  loginToGoogle(
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res);
  }

  @get('/auth/google/callback', {
    responses: {
      '200': {
        description: 'Callback from Google',
      },
    },
  })
  async googleCallback(
    @inject(RestBindings.Http.REQUEST) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      passport.authenticate('google', {session: false}, (err: any, user: any, info: any) => {
        console.log('Callback triggered:', {err, user, info}); // 🔍 Debug info

        if (err || !user) {
          res.status(401).json({error: 'Authentication failed'});
          return reject(err || new Error('User not found'));
        }

        // ✅ Auth succeeded
        res.redirect(`http://localhost:4200/success?token=${user.accessToken}`);
        return resolve();
      })(req, res);
    });
  }

  @get('/login-failed', {
    responses: {
      '200': {
        description: 'Login failed route',
      },
    },
  })
  loginFailed() {
    return {message: 'Login failed. Please try again.'};
  }
}
