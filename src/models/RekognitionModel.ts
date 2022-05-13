import BaseModel from './BaseModel';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from '../components/BaseRekognitionConnection';
import Configurator from '../components/Configurator';
import {DetectFacesResponse} from 'aws-sdk/clients/rekognition';

export default class RekognitionModel extends BaseModel {
  private readonly rekognition: Rekognition;
  bucketName: string;

  constructor (rekognitionConnection: BaseRekognitionConnection, configurator: Configurator) {
    super();
    this.rekognition = rekognitionConnection.getClient();
    this.bucketName = configurator.parameters('parameters.s3.bucketName');
  }

  async detectFaces (image: string) {
    const params : Rekognition.DetectFacesRequest = {
      Image: {
        S3Object: {
          Bucket: this.bucketName, //TODO remove hard coded bucket
          Name: image
        },
      },
      // todo define only attributes that we want
      Attributes: ['ALL']
    };
    return this.rekognition.detectFaces(params) as DetectFacesResponse;
  }

}
