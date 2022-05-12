import BaseModel from './BaseModel';
import RekognitionModel from './RekognitionModel';
import {IFaceDetails, IFinalResponse, IFrameInfo} from './interface';
import {DetectFacesResponse, FaceDetailList, FaceDetail} from 'aws-sdk/clients/rekognition';
import { ObjectList } from 'aws-sdk/clients/s3';


export default class SentimentModel extends BaseModel {
  constructor (private readonly rekognitionModel: RekognitionModel) {
    super();
  }

  manipulateData (facesArray : FaceDetailList) {
    let moodScore = 0;
    let attentionScore = 0;

    for (let face of facesArray) {
      face = this.removeUselessProps(face);
      moodScore += this.calculateMoodScore(face);
      attentionScore += this.calculateAttentionScore(face);
    }
    const amountOfPeople = this.AmountOfPeople(facesArray);
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

  async analyzeImages (images: ObjectList) {
    let moodPeak;
    let moodValley;
    let attentionPeak;
    let attentionValley;
    let peoplePeak;
    let peopleValley;
    const isImportantTreshold = 0.3;
    const sums = {
      attention: 0,
      mood: 0,
      people: 0
    };
    const framesArray: IFrameInfo[]  = [];
    for (const image of images) {
      const data = await this.feedImageToAWSReckon(image.Key); //needs to be parsed in production probably
      const frameInfo : IFrameInfo = this.manipulateData(data.FaceDetails);
      framesArray.push(frameInfo);
      sums.attention += frameInfo.attentionScore;
      sums.mood += frameInfo.moodScore;
      sums.people += frameInfo.amountOfPeople;
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

    const averages = {
      moodAverage: parseFloat((sums.mood / framesArray.length).toFixed(2)),
      attentionAverage: parseFloat((sums.attention  / framesArray.length).toFixed(2)),
      peopleAverage: Math.floor( sums.people / framesArray.length )
    };
    //calculating importance based on averages
    for (const frame of framesArray) {
      frame.isImportantAttention = this.calculateImportance(frame.attentionScore, averages.attentionAverage, isImportantTreshold);
      frame.isImportantMood = this.calculateImportance(frame.moodScore, averages.moodAverage, isImportantTreshold);
      frame.isImportantPeople = this.calculateImportance(frame.amountOfPeople, averages.peopleAverage, isImportantTreshold);
    }
    const response : IFinalResponse = {
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
      averages
    };
    return response;
  }

  private removeUselessProps (faceDetails : FaceDetail) {
    const cleanFaceDetails : IFaceDetails = {
      Emotions: [],
    };
    for (const key in cleanFaceDetails) {
      cleanFaceDetails[key as keyof IFaceDetails] = faceDetails[key as keyof IFaceDetails];
    }
    return cleanFaceDetails;
  }
  private calculateMoodScore (faceDetails : FaceDetail) {
    let moodScore  = 0;
    const confidence = parseFloat(faceDetails.Emotions[0].Confidence.toFixed(2));
    switch (faceDetails.Emotions[0].Type) {
    case 'CONFUSED':
      moodScore += 0.2 / 100 * confidence;
      break;
    case 'SURPRISED':
      moodScore += 0.8 / 100 * confidence;
      break;
    case 'HAPPY':
      moodScore += 0.9 / 100 * confidence;
      break;
    case 'CALM':
      moodScore += 0.5 / 100 * confidence;
      break;
    case 'FEAR':
      moodScore += 0.5 / 100 * confidence;
      break;
    case 'DISGUSTED':
      moodScore += 0.2 / 100 * confidence;
      break;
    case 'ANGRY':
      moodScore += 0.2 / 100 * confidence;
      break;
    case 'SAD':
      moodScore += 0.1 / 100 * confidence;
      break;
    }
    return parseFloat(moodScore.toFixed(2));
  }
  private calculateAttentionScore (faceDetails : FaceDetail) {
    let attentionScore = 0;
    for (const emotion of faceDetails.Emotions) {
      switch (emotion.Type) {
      case 'CONFUSED':
        attentionScore += 0.1 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      case 'SURPRISED':
        attentionScore += 0.6 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      case 'HAPPY':
        attentionScore += 0.6 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      case 'DISGUSTED':
        attentionScore += 0.1 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      case 'ANGRY':
        attentionScore += 0.25 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      case 'SAD':
        attentionScore += 0.3 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      case 'FEAR':
        attentionScore += 0.3 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      case 'CALM':
        attentionScore += 0.9 / 100 * parseFloat(emotion.Confidence.toFixed(2));
        break;
      }
      return parseFloat(attentionScore.toFixed(2));
    }
  }
  private AmountOfPeople (facesAnalysisArr : FaceDetailList) {
    return facesAnalysisArr.length;
  }
  private calculateImportance (score : number, average : number, threshold : number) {
    return score >= (average + (average * threshold)) || score <= (average - (average * threshold));
  }
}
