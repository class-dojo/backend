import {Request, Response, Router} from 'express';

import BaseController from './BaseController';

export default class AnalyzeController extends BaseController {

  register (router: Router): void {
    router.route('/v1/analyze').get((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  async actionDefault (request: Request, response: Response): Promise<void> {
    // get image ids from request
    // send them to aws rekognition for analysis
    // make transformation magic on the output
    // save it to json and to a bucket
    // send the output back to FE

    const result = {
      status: 'data-after-magic',
    };

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(result);
  }
}
