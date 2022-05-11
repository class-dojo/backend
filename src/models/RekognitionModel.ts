import BaseModel from './BaseModel';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from '../components/BaseRekognitionConnection';

export default class RekognitionModel extends BaseModel {
  private readonly rekognition: Rekognition;

  constructor (rekognitionConnection: BaseRekognitionConnection) {
    super();
    this.rekognition = rekognitionConnection.getClient();
  }

  detectFaces (image: string) {
    const params = {
      Image: {
        S3Object: {
          Bucket: 'images',
          Name: image
        },
      },
      // todo define only attributes that we want
      Attributes: ['ALL']
    };
    return this.rekognition.detectFaces(params);
  }

}
