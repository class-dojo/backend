export interface IRecognitionResponse {
  FaceDetails: IFaceDetails[];
 }

export interface IFaceDetails {
   Emotions?: IEmotion[],
 }

export interface IEmotion {
     Type?: string,
     Confidence?: number
 }

export interface IFrameInfo {
  amountOfPeople : number,
  attentionScore: number,
  moodScore: number,
  isImportantPeople? : boolean,
  isImportantAttention? : boolean,
  isImportantMood? : boolean,
}
export interface IFinalResponse {
  framesArray: IFrameInfo[];
    peaks: {
        moodPeak: number;
        attentionPeak: number;
        peoplePeak: number;
    };
    valleys: {
        moodValley: number;
        attentionValley: number;
        peopleValley: number;
    };
    averages: {
      moodAverage: number;
      attentionAverage: number;
      peopleAverage: number;
      }
}
