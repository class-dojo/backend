import BaseModel from './BaseModel';
import RekognitionModel from './RekognitionModel';
import {AmountOfPeople, calculateAttentionScore, calculateMoodScore, removeUselessProps} from './helpers';
import {IFaceDetails, IFrameInfo} from './interface';
import {DetectFacesResponse, FaceDetailList} from 'aws-sdk/clients/rekognition';

export default class SentimentModel extends BaseModel {
  constructor (private readonly rekognitionModel: RekognitionModel) {
    super();
  }

  manipulateData (facesArray : FaceDetailList) {
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
    return {
      attentionScore,
      moodScore,
      amountOfPeople
    };
  }

  async feedImageToAWSReckon (image : string) {
    const response = await this.rekognitionModel.detectFaces(image);
    return response as DetectFacesResponse;
  }

  async analyzeImages (images: string[]) {
    let moodPeak;
    let moodValley;
    let attentionPeak;
    let attentionValley;
    let peoplePeak;
    let peopleValley;
    const framesArray: IFrameInfo[]  = [];
    for (const image of images) {
      const data = await this.feedImageToAWSReckon(image); //needs to be parsed in production probably
      const frameInfo : IFrameInfo = this.manipulateData(data.FaceDetails);
      framesArray.push(frameInfo);

      // getting max and min values while in the loop
      if (!peoplePeak || frameInfo.amountOfPeople > peoplePeak) {
        peoplePeak = frameInfo.amountOfPeople;
      }
      if (!peopleValley || frameInfo.amountOfPeople < peopleValley) {
        peopleValley = frameInfo.amountOfPeople;
      }
      if (!attentionPeak || frameInfo.attentionScore > attentionPeak) {
        attentionPeak = frameInfo.attentionScore;
      }
      if (!attentionValley || frameInfo.attentionScore < attentionValley) {
        attentionValley = frameInfo.attentionScore;
      }
      if (!moodPeak || frameInfo.moodScore > moodPeak) {
        moodPeak = frameInfo.moodScore;
      }
      if (!moodValley || frameInfo.moodScore < moodValley) {
        moodValley = frameInfo.moodScore;
      }
    }
    return {
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
      averages: {
        // todo fix to weighted
        moodAverage: parseFloat(((moodPeak + moodValley) / 2).toFixed(2)),
        attentionAverage: parseFloat(((attentionPeak + attentionValley) / 2).toFixed(2)),
        peopleAverage: parseFloat(((peoplePeak + peopleValley) / 2).toFixed(2)),
      }
    };
  }

  private removeUselessProps (face: IFaceDetails) {
    return 1;
  }
}
