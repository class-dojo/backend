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
    router.route('/analyze').post((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  async actionDefault (request: Request, response: Response): Promise<void> {
    try {
      // get image ids from request
      const imagesToAnalyze = await this.imageModel.fetchImagesNames(request.body.videoId);
      // send them to aws rekognition for analysis - SentimentModel
      // make transformation magic on the output - SentimentModel
      const dataAfterMagic = await this.sentimentModel.analyzeImages(imagesToAnalyze);
      // add metadata to final result
      dataAfterMagic.videoName = request.body.videoName;
      dataAfterMagic.videoDate = request.body.videoDate;
      dataAfterMagic.duration = request.body.duration;
      dataAfterMagic.accuracy = request.body.accuracy;
      // save it to json and to a bucket - ImageModel
      // send the output back to FE
      await this.imageModel.storeFinalResults(dataAfterMagic, request.body.videoId);

      response.setHeader('Content-Type', 'application/json');
      response.status(200).json(dataAfterMagic);
    } catch (error) { //implement more catches
      console.log(error);
      response.status(400);
    }
  }
}


