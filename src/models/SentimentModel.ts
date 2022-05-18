import BaseModel from './BaseModel';
import RekognitionModel from './RekognitionModel';
import {IFaceDetails, IFacesDetail, IFinalResponse, IFrameInfo} from './interface';
import {DetectFacesResponse, FaceDetailList, FaceDetail, Emotions, Emotion} from 'aws-sdk/clients/rekognition';
import { ObjectList } from 'aws-sdk/clients/s3';


export default class SentimentModel extends BaseModel {
  constructor (private readonly rekognitionModel: RekognitionModel) {
    super();
  }

  manipulateData (facesArray : FaceDetailList): IFrameInfo {
    let moodScore = 0;
    let attentionScore = 0;

    const removeNonFaces = facesArray.filter(face => face.Confidence >= 90);

    const facesDetail: IFacesDetail[] = [];

    for (let face of removeNonFaces) {
      const faceInfo: IFacesDetail = {
        boundingBox: face.BoundingBox,
        topEmotion: SentimentModel.getMostProminentEmotion([...face.Emotions])
      };

      facesDetail.push(faceInfo);

      face = SentimentModel.removeUselessProps(face);
      moodScore += SentimentModel.calculateMoodScore(face);
      attentionScore += SentimentModel.calculateAttentionScore(face);


    }
    const amountOfPeople = SentimentModel.AmountOfPeople(removeNonFaces);
    if (amountOfPeople > 0) {
      moodScore = parseFloat((moodScore / amountOfPeople).toFixed(2));
      attentionScore = parseFloat((attentionScore / amountOfPeople).toFixed(2));
    }

    return {
      attentionScore,
      moodScore,
      amountOfPeople,
      facesDetail
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
      const frameInfo = this.manipulateData(data.FaceDetails);
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
    //calculating importance based on averages and previous value
    for (const frameIndex in framesArray) {
      framesArray[frameIndex].isImportantAttention = (SentimentModel.calculateImportance(framesArray[frameIndex].attentionScore, averages.attentionAverage, isImportantTreshold) && framesArray[+frameIndex - 1]?.isImportantAttention !== true);
      framesArray[frameIndex].isImportantMood = (SentimentModel.calculateImportance(framesArray[frameIndex].moodScore, averages.moodAverage, isImportantTreshold)&& framesArray[+frameIndex - 1]?.isImportantMood !== true);
      framesArray[frameIndex].isImportantPeople = (SentimentModel.calculateImportance(framesArray[frameIndex].amountOfPeople, averages.peopleAverage, isImportantTreshold)&& framesArray[+frameIndex - 1]?.isImportantPeople !== true);
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

  private static removeUselessProps (faceDetails : FaceDetail) {
    const cleanFaceDetails : IFaceDetails = {
      Emotions: [],
    };
    for (const key in cleanFaceDetails) {
      cleanFaceDetails[key as keyof IFaceDetails] = faceDetails[key as keyof IFaceDetails];
    }
    return cleanFaceDetails;
  }
  private static calculateMoodScore (faceDetails : FaceDetail) {
    let moodScore  = 0;

    const topEmotion = SentimentModel.getMostProminentEmotion(faceDetails.Emotions);

    const confidence = parseFloat(topEmotion.Confidence.toFixed(2));
    switch (topEmotion.Type) {
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
  private static calculateAttentionScore (faceDetails : FaceDetail) {
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
  private static AmountOfPeople (facesAnalysisArr : FaceDetailList) {
    return facesAnalysisArr.length;
  }
  private static calculateImportance (score : number, average : number, threshold : number) {
    return score >= (average + (average * threshold)) || score <= (average - (average * threshold));
  }

  private static getMostProminentEmotion (emotions: Emotions): Emotion {
    // sort emotions by confidence descending
    const sorted = emotions.sort((a, b) => {
      return b.Confidence - a.Confidence;
    });

    // pick the first one
    return sorted[0];
  }
}
