import Configurator from './Configurator';
import {Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from './BaseRekognitionConnection';
import * as mockResponse1 from '../mockResponses/mockResponse1.json';
import * as mockResponse2 from '../mockResponses/mockResponse2.json';
import * as mockResponse3 from '../mockResponses/mockResponse3.json';
import * as mockResponse4 from '../mockResponses/mockResponse4.json';

import {DetectFacesResponse} from 'aws-sdk/clients/rekognition';

export default class RekognitionConnectionLocal extends BaseRekognitionConnection {
  private readonly rekognition: Rekognition;

  constructor (configurator: Configurator) {
    super();
  }

  getClient (): Rekognition {
    return {
      detectFaces: (incomingData: Rekognition.DetectFacesRequest) => {
        const allMocks = {
          '1.jpg': mockResponse1,
          '2.jpg': mockResponse2,
          '3.jpg': mockResponse3,
          '4.jpg': mockResponse4,
        };
        const imgName : string[] = incomingData.Image.S3Object.Name.split('/');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const response = allMocks[imgName[imgName.length - 1]].default; //testvideo/1.jpg

        return {
          promise: () => Promise.resolve(response as DetectFacesResponse),
        };
      }
    } as Rekognition;
  }
}
