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
  importantFrame?: string
}
export interface IFinalResponse {
  framesArray: IFrameInfo[];
  videoName?: string;
  videoDate?: string;
  duration?: number;
  accuracy?: number;
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
