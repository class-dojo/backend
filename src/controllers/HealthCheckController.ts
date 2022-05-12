import {Request, Response, Router} from 'express';

import BaseController from './BaseController';
import Version from '../components/Version';

export default class HealthCheckController extends BaseController {

  constructor (private readonly version: Version) {
    super();
  }

  register (router: Router): void {
    router.route('/health-check').get((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  async actionDefault (request: Request, response: Response): Promise<void> {
    const result = {
      status: 'Healthy :)',
      versionInfo: this.version.getVersion(),
      buildDate: this.version.getBuildDate(),
      stable: this.version.isStable(),
    };

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(result);
  }
}
