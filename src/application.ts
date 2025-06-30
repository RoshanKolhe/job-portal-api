import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {CronComponent} from '@loopback/cron';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import multer from 'multer';
import path from 'path';

import {JWTStrategy} from './authentication-strategy/jwt-strategy';
import {
  EmailManagerBindings,
  FILE_UPLOAD_SERVICE,
  STORAGE_DIRECTORY,
} from './keys';
import {MySequence} from './sequence';
import {EmailService} from './services/email.service';
import {BcryptHasher} from './services/hash.password.bcrypt';
import {JWTService} from './services/jwt-service';
import {MyUserService} from './services/user-service';
import {LinkedinAuthService} from './services/linkedIn-auth.services';
import {GoogleAuthService} from './services/google-auth.service';
import { EventHistoryService } from './services/event-history.service';
import { StripeService } from './services/stripe.service';
import { CheckDailyEntriesAtNoon } from './services/cronjob.service';
import { RazorPayService } from './services/razorpay.service';
export {ApplicationConfig};

export class JobPortalApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.sequence(MySequence);

    this.setUpBinding();
    this.component(AuthenticationComponent);
    this.component(CronComponent);

    this.configureFileUpload(options.fileStorageDirectory);
    registerAuthenticationStrategy(this, JWTStrategy);

    this.static('/', path.join(__dirname, '../public'));

    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBinding(): void {
    this.bind('service.hasher').toClass(BcryptHasher);
    this.bind('service.jwt.service').toClass(JWTService);
    this.bind('service.user.service').toClass(MyUserService);

    this.bind('service.linkedinAuth.service').toClass(LinkedinAuthService);

    this.bind('service.googleAuth.service').toClass(GoogleAuthService);
    this.bind('service.eventhistory.service').toClass(EventHistoryService);
    this.bind('service.stripe.service').toClass(StripeService);
    this.bind('service.razorpay.service').toClass(RazorPayService);
    this.bind('service.cronjob.service').toClass(CheckDailyEntriesAtNoon);
    this.bind(EmailManagerBindings.SEND_MAIL).toClass(EmailService);
  }

  protected configureFileUpload(destination?: string) {
    destination = destination ?? path.join(__dirname, '../.sandbox');
    this.bind(STORAGE_DIRECTORY).to(destination);

    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        filename: (req, file, cb) => {
          const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
          const fileName = `${timestamp}_${file.originalname}`;
          cb(null, fileName);
        },
      }),
    };

    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
