import {Request, Response, Router} from 'express';
import S3LinkModel from '../models/S3LinkModel';

import BaseController from './BaseController';

export default class S3LinkController extends BaseController {

  constructor (private readonly s3LinkModel : S3LinkModel) {
    super();
  }

  register (router: Router): void {
    router.route('/getLinks').post((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  async actionDefault (request: Request, response: Response): Promise<void> {
    const links = this.s3LinkModel.getLinks(request.body.frames);
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(links);
  }
}
