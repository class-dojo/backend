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
      detectFaces: (params) => {
        const allMocks = {
          'image.jpg': mockResponse1,
          'image2.jpg': mockResponse2,
          'image3.jpg': mockResponse3,
          'image4.jpg': mockResponse4,
          'image5.jpg': mockResponse5,
          'image6.jpg': mockResponse6,
          'image7.jpg': mockResponse7,
          'image8.jpg': mockResponse8,
          'image9.jpg': mockResponse9,
          'image10.jpg': mockResponse10,
          'image11.jpg': mockResponse11,
          'image12.jpg': mockResponse12,
          'image13.jpg': mockResponse13,
          'image14.jpg': mockResponse14,
          'image15.jpg': mockResponse15,
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const imgName : string[] = params.Image.S3Object.Name.split('/');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const response = allMocks[imgName[imgName.length - 1]].default; //testvideo/image1.jpg
        return response as DetectFacesResponse;

      }
    } as Rekognition;
  }
}
