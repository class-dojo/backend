import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import {Request, Response} from 'express';
import fn = jest.fn;
import S3LinkController from '../../src/controllers/S3LinkController';

describe('S3 Link Controller', () => {
  const container = containerBuilder();
  const s3LinkController = container.get('s3LinkController') as S3LinkController;

  test('run action Default', () => {
    const request = {
      body: {
        videoId: 'uuidofvide',
        frames: ['uuidofvide/22.jpg', 'uuidofvide/33.jpg']
      }
    } as Request;
    const response = {
      json: fn((data) => {
        // const fileNames = Object.keys(data);
        expect(data.links).toHaveLength(2);
        // expect(fileNames).toStrictEqual(['image22.jpg', 'image33.jpg']);
      }) as unknown,
      status: (code) => {
        expect(code).toBe(200);
        return response;
      },
      setHeader: (() => {
        return;
      }) as unknown,
    } as Response;

    s3LinkController.actionDefault(request, response);

    expect(response.json).toBeCalledTimes(1);
  });
});
