import BaseModel from './BaseModel';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from '../components/BaseRekognitionConnection';

export default class RekognitionModel extends BaseModel {
  private readonly rekognition: Rekognition;

  constructor (rekognitionConnection: BaseRekognitionConnection) {
    super();
    this.rekognition = rekognitionConnection.getClient();
  }

  async detectFaces (image: string) {
    const params : Rekognition.DetectFacesRequest = {
      Image: {
        S3Object: {
          Bucket: 'images', //TODO remove hard coded bucket
          Name: image
        },
      },
      // todo define only attributes that we want
      Attributes: ['ALL']
    };
    const facesResult = await this.rekognition.detectFaces(params);
    return facesResult;
  }

}
