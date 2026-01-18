import { randomBytes } from 'crypto';

export class RequesIDService {
  constructor() {}

  async createRequestId(): Promise<string> {
    return randomBytes(8).toString('hex');
  }
}
