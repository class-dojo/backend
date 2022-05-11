import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import SentimentModel from '../../src/models/SentimentModel';

describe('Sentiment model', () => {
  const container = containerBuilder();
  const sentimentModel = container.get('sentimentModel') as SentimentModel;

  test('should calculate scores', async () => {

    const awsDetectFacesResponse = await sentimentModel.feedImageToAWSReckon('image.jpg');
    const analyzed = sentimentModel.manipulateData(awsDetectFacesResponse.FaceDetails);

    expect(analyzed.attentionScore).toBe(0.15);
    expect(analyzed.moodScore).toBe(0.25);
    expect(analyzed.amountOfPeople).toBe(4);
  });

  test('should display correct final results', async () => {

    const finalResults = await sentimentModel.analyzeImages(['image.jpg']);
    // check frame array
    expect(finalResults.framesArray).toHaveLength(1);

    // check for peaks and valleys
    expect(finalResults.peaks.peoplePeak).toBe(4);
    expect(finalResults.peaks.moodPeak).toBe(0.25);
    expect(finalResults.peaks.attentionPeak).toBe(0.15);
    expect(finalResults.valleys.moodValley).toBe(0.25);
    expect(finalResults.valleys.attentionValley).toBe(0.15);
    expect(finalResults.valleys.peopleValley).toBe(4);

    // check for averages
    expect(finalResults.averages.attentionAverage).toBe(0.15);
    expect(finalResults.averages.moodAverage).toBe(0.25);
    expect(finalResults.averages.peopleAverage).toBe(4);
  });
});
