import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import SentimentModel from '../../src/models/SentimentModel';

describe('Sentiment model', () => {
  const container = containerBuilder();
  const sentimentModel = container.get('sentimentModel') as SentimentModel;

  test('should calculate scores', async () => {

    const awsDetectFacesResponse = await sentimentModel.feedImageToAWSReckon([{Key:'testVideo/1.jpg'}]);

    const analyzed = sentimentModel.manipulateData(awsDetectFacesResponse[0].FaceDetails);

    expect(analyzed.attentionScore).toBe(0.56);
    expect(analyzed.moodScore).toBe(0.49);
    expect(analyzed.amountOfPeople).toBe(4);
  });

  test('should display correct final results', async () => {

    const finalResults = await sentimentModel.analyzeImages([{Key: 'testVideo/2.jpg'},{Key: 'testVideo/1.jpg'}]);
    // check frame array

    expect(finalResults.framesArray).toHaveLength(2);

    // check for peaks and valleys
    expect(finalResults.peaks.peoplePeak).toBe(4);
    expect(finalResults.peaks.moodPeak).toBe(0.49);
    expect(finalResults.peaks.attentionPeak).toBe(0.61);
    expect(finalResults.valleys.moodValley).toBe(0.32);
    expect(finalResults.valleys.attentionValley).toBe(0.56);
    expect(finalResults.valleys.peopleValley).toBe(3);
    expect(finalResults.framesArray[0].isImportantAttention).toBe(false);
    expect(finalResults.framesArray[0].isImportantMood).toBe(true);
    expect(finalResults.framesArray[0].isImportantPeople).toBe(true);

    // check for averages
    expect(finalResults.averages.attentionAverage).toBe(0.58);
    expect(finalResults.averages.moodAverage).toBe(0.41);
    expect(finalResults.averages.peopleAverage).toBe(3);
  });
});
