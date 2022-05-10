import Configurator from './Configurator';
import {Credentials, Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from './BaseRekognitionConnection';

export default class RekognitionConnectionLocal extends BaseRekognitionConnection {
  private readonly rekognition: Rekognition;

  constructor (configurator: Configurator) {
    super();
  }

  getClient (): Rekognition {
    return {
      detectFaces: () => {
        return;
      }
    } as Rekognition;
  }
}
