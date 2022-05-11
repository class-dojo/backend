import Configurator from './Configurator';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from './BaseRekognitionConnection';
import * as mockResponse1 from '../../tests/mockResponses/mockResponse1.json';
import {DetectFacesResponse} from 'aws-sdk/clients/rekognition';

export default class RekognitionConnectionLocal extends BaseRekognitionConnection {
  private readonly rekognition: Rekognition;

  constructor (configurator: Configurator) {
    super();
  }

  getClient (): Rekognition {
    return {
      detectFaces: (image) => {
        const allMocks = {
          mockResponse1,
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const response = allMocks[filename].default;
        return response as DetectFacesResponse;
      }
    } as Rekognition;
  }
}
