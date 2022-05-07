import { IFaceDetails, IRecognitionResponse } from '../interfaces';


export function removeUselessProps (faceDetails : never) {
  const cleanFaceDetails : IFaceDetails = {
    EyesOpen: {
      Value: false,
      Confidence: 0
    },
    Emotions: [],
  };
  for (const key in cleanFaceDetails) {
    cleanFaceDetails[key as keyof IFaceDetails] = faceDetails[key as keyof IFaceDetails];
  }
  return cleanFaceDetails;
}

export function calculateMoodScore (faceDetails : IFaceDetails) {
  let moodScore  = 0;
  switch (faceDetails.Emotions[0].Type) {
  case 'CONFUSED':
    moodScore -= 2 / 100 * faceDetails.Emotions[0].Confidence;
    break;
  case 'SURPRISED':
    moodScore += 2 / 100 * faceDetails.Emotions[0].Confidence;
    break;
  case 'HAPPY':
    moodScore += 3 / 100 * faceDetails.Emotions[0].Confidence;
    break;
  case 'DISGUSTED':
    moodScore -= 2 / 100 * faceDetails.Emotions[0].Confidence;
    break;
  case 'ANGRY':
    moodScore -= 2 / 100 * faceDetails.Emotions[0].Confidence;
    break;
  case 'SAD':
    moodScore -= 3 / 100 * faceDetails.Emotions[0].Confidence;
    break;
/*     case 'CALM':
      moodScore = +||- 2 / 100 * faceDetails.Emotions[0].Confidence;
      break; */
  }
  return moodScore;
}

export function AmountOfPeople (facesAnalysisArr : IRecognitionResponse[]) {
  return facesAnalysisArr.length;
}

export function calculateAttentionScore (facesAnalysisArr : IFaceDetails[]) {
  const emotionsArray = [];
  for (const faceDetails of facesAnalysisArr) {
    emotionsArray.push(faceDetails.Emotions[0].Type);
  }
  //!!! decisions have to be taken here 10 30%
}





