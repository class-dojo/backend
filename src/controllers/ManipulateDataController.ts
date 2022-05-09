import {Request, Response, Router} from 'express';
import {AmountOfPeople} from '../models/helpers';
import BaseController from './BaseController';

export default class ManipulateDataController extends BaseController {
  register (router: Router): void {
    router.route('/manipulateData').post((request: Request, response: Response) => {
      return this.actionDefault(request, response);
    });
  }

  actionDefault (request: Request, response: Response): void {
    const facesArray = request.body;
    const amountOfPeople = AmountOfPeople(facesArray);
    const result = {
      amountOfPeople: amountOfPeople
    };
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json(result);
  }
}
