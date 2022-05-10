import BaseModel from './BaseModel';
import RekognitionConnection from '../components/RekognitionConnection';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from '../components/BaseRekognitionConnection';
import * as mockResponse from '../../tests/mockResponses/mockResponse1.json';


export default class RekognitionModel extends BaseModel {
  private readonly rekognition: Rekognition;

  constructor (rekognitionConnection: BaseRekognitionConnection) {
    super();
    this.rekognition = rekognitionConnection.getClient();
  }

  detectFaces (imageIds: string[]) {
    return mockResponse;
    //this.rekognition.detectFaces();
  }

}
