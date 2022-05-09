import {Request, Response, Router} from 'express';

import BaseController from './BaseController';

export default class TestController extends BaseController {
  register (router: Router): void {
    router.route('/test').get((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  actionDefault (request: Request, response: Response): void {

    const result = {
      message: 'hello world'
    };

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(result);
  }
}
