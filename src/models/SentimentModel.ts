import BaseModel from './BaseModel';
import RekognitionModel from './RekognitionModel';
import {AmountOfPeople, calculateAttentionScore, calculateMoodScore, removeUselessProps} from '../models/helpers';
import { IFaceDetails } from './interface';

export default class SentimentModel extends BaseModel {
  constructor (private readonly rekognitionModel: RekognitionModel) {
    super();
  }
  manipulateData (facesArray : IFaceDetails[]) {
    let moodScore = 0;
    let attentionScore = 0;
    for (let face of facesArray) {
      face = removeUselessProps(face);
      moodScore += calculateMoodScore(face);
      attentionScore = calculateAttentionScore(face);
    }
    const amountOfPeople = AmountOfPeople(facesArray);
    moodScore = parseFloat((moodScore / amountOfPeople).toFixed(2));
    attentionScore = parseFloat((attentionScore / amountOfPeople).toFixed(2));
    const result = {
      attentionScore,
      moodScore,
      amountOfPeople
    }; return result;}
}
