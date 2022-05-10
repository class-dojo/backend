import Configurator from './Configurator';
import {Credentials, Rekognition} from 'aws-sdk';
import BaseRekognitionConnection from './BaseRekognitionConnection';

export default class RekognitionConnection extends BaseRekognitionConnection {
  private readonly rekognition: Rekognition;

  constructor (configurator: Configurator) {
    super();
    const { accessKeyId, secretAccessKey, session } = configurator.parameters('aws') as Record<string, string>;
    const { region, endpoint } = configurator.parameters('rekognition') as Record<string, string>;
    this.rekognition = new Rekognition({
      region,
      endpoint,
      credentials: new Credentials(accessKeyId, secretAccessKey, session),
    });
  }

  getClient (): Rekognition {
    return this.rekognition;
  }

}
