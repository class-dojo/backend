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
    const request = {
      body: {
        videoUid: 'testVideo'
      }
    } as Request;
    const response = {
      json: fn((data) => {
        expect(data).toStrictEqual({
          status: 'Healthy :)',
          versionInfo: 'dev',
          buildDate: null,
          stable: false,
        });
      }) as unknown,
      status: (code) => {
        expect(code).toBe(200);
        return response;
      },
      setHeader: (() => {
        return;
      }) as unknown,
    } as Response;
    const image1 = await s3Model.put(imageBucketName, 'testVideo/image.jpg', '');
    const image2 = await s3Model.put(imageBucketName, 'testVideo/image2.jpg', '');
    await analyzeController.actionDefault(request, response);

    expect(response.json).toBeCalledTimes(1);
  });
});
