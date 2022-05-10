import BaseModel from './BaseModel';
import RekognitionConnection from '../components/RekognitionConnection';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from '../components/BaseRekognitionConnection';

export default class RekognitionModel extends BaseModel {
  private readonly rekognition: Rekognition;

  constructor (rekognitionConnection: BaseRekognitionConnection) {
    super();
    this.rekognition = rekognitionConnection.getClient();
  }

  detectFaces (imageIds: string[]) {
    return;
    //this.rekognition.detectFaces();
  }

}
