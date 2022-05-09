export interface IRecognitionResponse {
  FaceDetails: IFaceDetails[];
 }

export interface IFaceDetails {
   Emotions: IEmotion[],
 }

export interface IEmotion {
     Type: string,
     Confidence: number
 }

