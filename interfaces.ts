export interface IRecognitionResponse {
 FaceDetails: IFaceDetails[];
}

export interface IFaceDetails {
  EyesOpen: {
  Value: boolean,
  Confidence: number
},
  Emotions: IEmotion[],
  Pose: {
    Roll: number,
    Yaw: number,
    Pitch: number,
  }
}

export interface IEmotion {
    Type: boolean,
    Confidence: number
}
