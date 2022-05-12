import BaseModel from './BaseModel';
import RekognitionModel from './RekognitionModel';
import {IFaceDetails, IFrameInfo} from './interface';
import {DetectFacesResponse, FaceDetailList, FaceDetail} from 'aws-sdk/clients/rekognition';


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
      attentionScore = this.calculateAttentionScore(face);
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

    const response = {
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

    // todo determineImportance based on average from the calculated frames rather than use arbitrary threshold

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
      moodScore -= 2 / 100 * confidence;
      break;
    case 'SURPRISED':
      moodScore += 2 / 100 * confidence;
      break;
    case 'HAPPY':
      moodScore += 3 / 100 * confidence;
      break;
    case 'DISGUSTED':
      moodScore -= 2 / 100 * confidence;
      break;
    case 'ANGRY':
      moodScore -= 2 / 100 * confidence;
      break;
    case 'SAD':
      moodScore -= 3 / 100 * confidence;
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
}
