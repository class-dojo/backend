import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import AnalyzeController from '../../src/controllers/AnalyzeController';
import {Request, Response} from 'express';
import fn = jest.fn;
import S3Model from '../../src/models/S3Model';
import Configurator from '../../src/components/Configurator';

describe('Analyze Controller', () => {
  const container = containerBuilder();
  const analyzeController = container.get('analyzeController') as AnalyzeController;
  const s3Model = container.get('s3Model') as S3Model;
  const configurator = container.get('configurator') as Configurator;
  const imageBucketName = configurator.parameters('parameters.s3.bucketName');

  test('run action Default', async () => {
    await s3Model.put(imageBucketName, 'testVideo/1.jpg', '');
    await s3Model.put(imageBucketName, 'testVideo/2.jpg', '');

    const expectedOutput = {

      averages: {attentionAverage: 0.58, moodAverage: 0.41, peopleAverage: 3},
      framesArray: [{
        amountOfPeople: 4,
        attentionScore: 0.56,
        isImportantAttention: false,
        isImportantMood: true,
        isImportantPeople: true,
        moodScore: 0.49
      }, {
        amountOfPeople: 3,
        attentionScore: 0.61,
        isImportantAttention: false,
        isImportantMood: true,
        isImportantPeople: false,
        moodScore: 0.32
      }],
      peaks: {attentionPeak: 0.61, moodPeak: 0.49, peoplePeak: 4},
      valleys: {attentionValley: 0.56, moodValley: 0.32, peopleValley: 3}

    };

    const request = {
      body: {
        videoId: 'testVideo'
      }
    } as Request;
    const response = {
      json: fn((data) => {
        expect(data).toStrictEqual(expectedOutput);
      }) as unknown,
      status: (code) => {
        expect(code).toBe(200);
        return response;
      },
      setHeader: (() => {
        return;
      }) as unknown,
    } as Response;

    await analyzeController.actionDefault(request, response);
    expect(response.json).toBeCalledTimes(1);
  });
});
