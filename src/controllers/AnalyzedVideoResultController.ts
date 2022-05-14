import {Request, Response, Router} from 'express';
import S3GetAnalyzedVideoResultModel from '../models/S3GetAnalyzedVideoResultModel';
import BaseController from './BaseController';

export default class AnalyzedVideoResultController extends BaseController {

  constructor (private readonly s3GetAnalyzedVideoResultModel : S3GetAnalyzedVideoResultModel) {
    super();
  }

  register (router: Router): void {
    router.route('/video/:id').get((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  async actionDefault (request: Request, response: Response): Promise<void> {
    try {
      const analysisResult = await this.s3GetAnalyzedVideoResultModel.getResult(request.params.id);
      response.setHeader('Content-Type', 'application/json');
      response.status(200).json({analysisResult});
    } catch (error) {
      response.status(501).json({message: 'no such file'});
    }
  }
}
