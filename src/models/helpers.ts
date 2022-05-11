import { IFaceDetails } from './interface';


export function removeUselessProps (faceDetails : IFaceDetails) {
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

export function AmountOfPeople (facesAnalysisArr : IFaceDetails[]) {
  return facesAnalysisArr.length;
}

export function calculateAttentionScore (faceDetails : IFaceDetails) {
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





