export interface IRecognitionResponse {
 FaceDetails: IFaceDetails[];
}

export interface IFaceDetails {
  Smile: {
    Value: boolean,
    Confidence: number
  },
  AgeRange: {
    Low: number,
    High: number,
},
  Gender: {
    Value: string,
    Confidence: number
},
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
