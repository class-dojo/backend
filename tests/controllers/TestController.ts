import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import TestController from '../../src/controllers/TestController';
import {Request, Response} from 'express';
import fn = jest.fn;

describe('Test Controller', () => {
  const container = containerBuilder();
  const testController = container.get('testController') as TestController;

  test('run action Default', () => {

    const request = {} as Request;
    const response = {
      json: fn((data) => {
        expect(data).toStrictEqual({
          'message': 'hello world',
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

    testController.actionDefault(request, response);

    expect(response.json).toBeCalledTimes(1);
  });
});
