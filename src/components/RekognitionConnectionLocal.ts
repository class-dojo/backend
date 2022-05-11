import Configurator from './Configurator';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from './BaseRekognitionConnection';
import * as mockResponse from '../../tests/mockResponses/mockResponse1.json';
import {DetectFacesResponse} from 'aws-sdk/clients/rekognition';

export default class RekognitionConnectionLocal extends BaseRekognitionConnection {
  private readonly rekognition: Rekognition;

  constructor (configurator: Configurator) {
    super();
  }

  getClient (): Rekognition {
    return {
      detectFaces: (image) => {
        return mockResponse as DetectFacesResponse;
      }
    } as Rekognition;
  }
}
