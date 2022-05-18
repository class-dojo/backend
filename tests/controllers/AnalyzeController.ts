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
      accuracy: 5,
      duration: 30,
      videoDate: '17/05/2022',
      videoName: 'My test video',
      averages: {attentionAverage: 0.58, moodAverage: 0.41, peopleAverage: 3},
      framesArray: [{
        amountOfPeople: 4,
        attentionScore: 0.56,
        isImportantAttention: false,
        isImportantMood: false,
        isImportantPeople: true,
        moodScore: 0.49,
        importantFrame: 'testVideo/1.jpg',
        facesDetail:  [
          {
            boundingBox: {
              Width: 0.12799087166786194,
              Height: 0.31783920526504517,
              Left: 0.6253703832626343,
              Top: 0.08763377368450165
            },
            topEmotion: { Type: 'CONFUSED', Confidence: 99.63795471191406 }
          },
          {
            boundingBox: {
              Width: 0.09457354992628098,
              Height: 0.22096648812294006,
              Left: 0.17085716128349304,
              Top: 0.6672175526618958
            },
            topEmotion: { Type: 'CALM', Confidence: 96.443603515625 }
          },
          {
            boundingBox: {
              Width: 0.0846099704504013,
              Height: 0.19836215674877167,
              Left: 0.20270614326000214,
              Top: 0.16728106141090393
            },
            topEmotion: { Type: 'CALM', Confidence: 77.0023193359375 }
          },
          {
            boundingBox: {
              Width: 0.07510853558778763,
              Height: 0.16585884988307953,
              Left: 0.7116361260414124,
              Top: 0.6801782250404358
            },
            topEmotion: { Type: 'HAPPY', Confidence: 99.23162841796875 }
          }
        ]
      }, {
        amountOfPeople: 3,
        attentionScore: 0.61,
        isImportantAttention: false,
        isImportantMood: true,
        isImportantPeople: false,
        importantFrame: 'testVideo/2.jpg',
        moodScore: 0.32,
        facesDetail: [
          {
            boundingBox: {
              Width: 0.13665208220481873,
              Height: 0.27526575326919556,
              Left: 0.198362797498703,
              Top: 0.7325266599655151
            },
            topEmotion: { Type: 'SAD', Confidence: 98.96540069580078 }
          },
          {
            boundingBox: {
              Width: 0.09949468821287155,
              Height: 0.24421581625938416,
              Left: 0.24007287621498108,
              Top: 0.12005813419818878
            },
            topEmotion: { Type: 'CALM', Confidence: 99.75934600830078 }
          },
          {
            boundingBox: {
              Width: 0.07053308933973312,
              Height: 0.16228044033050537,
              Left: 0.7046615481376648,
              Top: 0.6824442744255066
            },
            topEmotion: { Type: 'CALM', Confidence: 71.59647369384766 }
          }
        ]
      }],
      peaks: {attentionPeak: 0.61, moodPeak: 0.49, peoplePeak: 4},
      valleys: {attentionValley: 0.56, moodValley: 0.32, peopleValley: 3}

    };

    const request = {
      body: {
        videoId: 'testVideo',
        accuracy: 5,
        duration: 30,
        videoDate: '17/05/2022',
        videoName: 'My test video',
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
