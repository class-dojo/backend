import { IFaceDetails, IRecognitionResponse } from '../interface';


export function removeUselessProps (faceDetails : never) {
  const cleanFaceDetails : IFaceDetails = {
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
  }
  return moodScore;
}

export function AmountOfPeople (facesAnalysisArr : IRecognitionResponse[]) {
  return facesAnalysisArr.length;
}

export function calculateAttentionScore (faceDetails : IFaceDetails) {
  let attentionScore = 0;
  for (const emotion of faceDetails.Emotions) {
    switch (emotion.Type) {
    case 'CONFUSED':
      attentionScore += 0.1 / 100 * emotion.Confidence;
      break;
    case 'SURPRISED':
      attentionScore += 0.6 / 100 * emotion.Confidence;
      break;
    case 'HAPPY':
      attentionScore += 0.6 / 100 * emotion.Confidence;
      break;
    case 'DISGUSTED':
      attentionScore += 0.1 / 100 * emotion.Confidence;
      break;
    case 'ANGRY':
      attentionScore += 0.25 / 100 * emotion.Confidence;
      break;
    case 'SAD':
      attentionScore += 0.3 / 100 * emotion.Confidence;
      break;
    case 'FEAR':
      attentionScore += 0.3 / 100 * emotion.Confidence;
      break;
    case 'CALM':
      attentionScore += 0.9 / 100 * emotion.Confidence;
      break;
    }
    attentionScore /= 8;
    return attentionScore;
  }
}





