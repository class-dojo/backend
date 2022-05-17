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
    if (amountOfPeople > 0) {
      moodScore = parseFloat((moodScore / amountOfPeople).toFixed(2));
      attentionScore = parseFloat((attentionScore / amountOfPeople).toFixed(2));
    }

    return {
      attentionScore,
      moodScore,
      amountOfPeople
    };
  }
  sortImages (images : ObjectList) {
    images.sort((a,b) => Number(a.Key.match(/\d+(?=\.jpg$)/g)) - Number(b.Key.match(/\d+(?=\.jpg$)/g)));
  }

  async feedImageToAWSReckon (images: ObjectList): Promise<DetectFacesResponse[]> {

    const promises: Promise<DetectFacesResponse>[] = [];

    for (const image of images) {
      const imagePromise = this.rekognitionModel.detectFaces(image.Key);
      promises.push(imagePromise);
    }

    return Promise.all(promises) ;
  }

  async analyzeImages (images: ObjectList) {
    let moodPeak;
    let moodValley;
    let attentionPeak;
    let attentionValley;
    let peoplePeak;
    let peopleValley;
    const isImportantTreshold = 0.3;
    let imagesIndex = 0;
    const sums = {
      attention: 0,
      mood: 0,
      people: 0
    };
    const framesArray: IFrameInfo[]  = [];
    //sort
    this.sortImages(images);

    const detectedFacesImages = await this.feedImageToAWSReckon(images); //needs to be parsed in production probably
    for (const data of detectedFacesImages) {
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
    //calculating importance based on averages and previus value
    for (const frameIndex in framesArray) {
      framesArray[frameIndex].isImportantAttention = (this.calculateImportance(framesArray[frameIndex].attentionScore, averages.attentionAverage, isImportantTreshold) && framesArray[+frameIndex - 1]?.isImportantAttention !== true);
      framesArray[frameIndex].isImportantMood = (this.calculateImportance(framesArray[frameIndex].moodScore, averages.moodAverage, isImportantTreshold)&& framesArray[+frameIndex - 1]?.isImportantMood !== true);
      framesArray[frameIndex].isImportantPeople = (this.calculateImportance(framesArray[frameIndex].amountOfPeople, averages.peopleAverage, isImportantTreshold)&& framesArray[+frameIndex - 1]?.isImportantPeople !== true);
      if (framesArray[frameIndex].isImportantAttention || framesArray[frameIndex].isImportantMood || framesArray[frameIndex].isImportantPeople) {
        framesArray[frameIndex].importantFrame = images[imagesIndex].Key;
      }
      imagesIndex++;
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
