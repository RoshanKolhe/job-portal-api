
import {ApplicationConfig, JobPortalApiApplication} from './application';
const expressSession = require('express-session'); // ✅ safe in LB4

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new JobPortalApiApplication(options);

  require('dotenv').config();

  await app.boot();

const expressSession = require('express-session');
const passport = require('passport');
require('./services/google-auth.service');

passport.serializeUser((user: any, done: any) => done(null, user));
passport.deserializeUser((user: any, done: any) => done(null, user));

app.expressMiddleware('middleware.session', expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));


app.expressMiddleware('middleware.passportSession', passport.session());

  passport.serializeUser((user: any, done: any) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done:any) => {
    done(null, user);
  });

  // 👇 Start the app after middleware is applied
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}


if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST || '127.0.0.1',
      gracePeriodForClose: 5000,
      openApiSpec: {
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
