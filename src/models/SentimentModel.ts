import BaseModel from './BaseModel';
import RekognitionModel from './RekognitionModel';

export default class SentimentModel extends BaseModel {
  constructor (private readonly rekognitionModel: RekognitionModel) {
    super();
  }
  analyzeImages (images : string[]) {
    return this.rekognitionModel.detectFaces(images);
  }
}
