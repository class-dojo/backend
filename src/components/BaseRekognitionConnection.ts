import {Rekognition} from 'aws-sdk';

export default abstract class BaseRekognitionConnection {
  getClient (): Rekognition {
    throw new Error('Implement me!');
  }
}
