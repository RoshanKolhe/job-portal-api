/* eslint-disable @typescript-eslint/return-await */
import * as nodemailer from 'nodemailer';
import SITE_SETTINGS from '../utils/config';
export interface EmailManager<T = Object> {
  sendMail(mailObj: any): Promise<T>;
}

export class EmailService {
  constructor() {}

  private isRetryable(error: any): boolean {
    const responseCode = Number(error?.responseCode);
    const response = String(error?.response || '');
    return (
      responseCode === 421 ||
      response.includes('421-4.7.0') ||
      (error?.code === 'ECONNECTION' && response.includes('Try again later'))
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendMail(mailObj: any): Promise<object> {
    const maxRetries = Number(process.env.SMTP_MAX_RETRIES || 2);
    const retryDelayMs = Number(process.env.SMTP_RETRY_DELAY_MS || 1500);

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const transporter = nodemailer.createTransport(SITE_SETTINGS.email);
        return await transporter.sendMail(mailObj);
      } catch (error: any) {
        const shouldRetry = attempt < maxRetries && this.isRetryable(error);
        if (!shouldRetry) {
          throw error;
        }

        await this.sleep(retryDelayMs * (attempt + 1));
      }
    }

    throw new Error('Mail sending failed after retries');
  }
}
