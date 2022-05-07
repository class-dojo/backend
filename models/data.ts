import { IFaceDetails } from '../interfaces';


function cleanData (faceDetails : IFaceDetails) {
  const usefulFaceProps : string[] = ['Smile','AgeRange','Gender','EyesOpen','Emotions','Pose'];
  const cleanFaceDetails : IFaceDetails = {
    Smile: {
      Value: false,
      Confidence: 0
    },
    AgeRange: {
      Low: 0,
      High: 0
    },
    Gender: {
      Value: '',
      Confidence: 0
    },
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
  for (const prop of usefulFaceProps) {
    cleanFaceDetails[prop] = faceDetails[prop];
  }
  return cleanFaceDetails;
}
