import { IFaceDetails } from '../interfaces';


export function removeUselessProps (faceDetails : never) {
  const cleanFaceDetails : IFaceDetails = {
    EyesOpen: {
      Value: false,
      Confidence: 0
    },
    Emotions: [],
    Pose: {
      Roll: 0,
      Yaw: 0,
      Pitch: 0
    }
  };
  for (const key in cleanFaceDetails) {
    cleanFaceDetails[key as keyof IFaceDetails] = faceDetails[key as keyof IFaceDetails];
  }
  return cleanFaceDetails;
}




