import {Request, Response, Router} from 'express';

import BaseController from './BaseController';
import ImageModel from '../models/ImageModel';
import SentimentModel from '../models/SentimentModel';

export default class AnalyzeController extends BaseController {
  constructor (
    private readonly imageModel: ImageModel,
    private readonly sentimentModel: SentimentModel,
  ) {
    super();
  }

  register (router: Router): void {
    router.route('/v1/analyze').get((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  async actionDefault (request: Request, response: Response): Promise<void> {
    // get image ids from request
    // check that images exist on S3 bucket - bulk - ImageModel
    // send them to aws rekognition for analysis - SentimentModel
    // make transformation magic on the output - SentimentModel
    // save it to json and to a bucket - ImageModel
    // send the output back to FE

    const result = {
      status: 'data-after-magic',
    };

    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(result);
  }
}
