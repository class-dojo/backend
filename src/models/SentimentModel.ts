import BaseModel from './BaseModel';
import RekognitionModel from './RekognitionModel';
import {AmountOfPeople, calculateAttentionScore, calculateMoodScore, removeUselessProps} from '../models/helpers';
import { IFaceDetails, IFrameInfo } from './interface';

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
    };
    return result;}

  async feedImageToAWSReckon (image : string) {
    const response = await this.rekognitionModel.detectFaces(image);
    return response;
  }

  async analyzeImages (images: string[]) {
    let moodPeak = 0;
    let moodValley = 0;
    let attentionPeak = 0;
    let attentionValley = 0;
    let peoplePeak = 0;
    let peopleValley = 0;
    const framesArray: IFrameInfo[]  = [];
    for (const image of images) {
      const data = await this.feedImageToAWSReckon(image); //needs to be parsed in production probably
      const frameInfo : IFrameInfo = this.manipulateData(data.FaceDetails);
      framesArray.push(frameInfo);
      if (frameInfo.amountOfPeople > peoplePeak) {
        peoplePeak = frameInfo.amountOfPeople;
      }
      if (frameInfo.amountOfPeople < peopleValley) {
        peopleValley = frameInfo.amountOfPeople;
      }
      if (frameInfo.attentionScore > attentionPeak) {
        attentionPeak = frameInfo.attentionScore;
      }
      if (frameInfo.attentionScore < attentionValley) {
        attentionValley = frameInfo.attentionScore;
      }
      if (frameInfo.moodScore > moodPeak) {
        moodPeak = frameInfo.moodScore;
      }
      if (frameInfo.moodScore < moodValley) {
        moodValley = frameInfo.moodScore;
      }
    }
    const result = {
      framesArray,
      peaks: {
        moodPeak,
        attentionPeak,
        peoplePeak
      },
      valleys: {
        moodValley,
        attentionValley,
        peopleValley,
      },
      averages : {
        moodAverage: parseFloat(((moodPeak + moodValley)/2).toFixed(2)),
        attentionAverage: parseFloat(((attentionPeak + attentionValley)/2).toFixed(2)),
        peopleAverage: parseFloat(((peoplePeak + peopleValley)/2).toFixed(2)),
      }
    };
    return result;
  }
}
