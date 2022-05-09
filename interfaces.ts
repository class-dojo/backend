export interface IRecognitionResponse {
 FaceDetails: IFaceDetails[];
}

export interface IFaceDetails {
  EyesOpen: {
  Value: boolean,
  Confidence: number
},
  Emotions: IEmotion[],
}

export interface IEmotion {
    Type: string,
    Confidence: number
}







