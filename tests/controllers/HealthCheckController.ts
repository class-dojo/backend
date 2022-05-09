import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import HealthCheckController from '../../src/controllers/HealthCheckController';
import {Request, Response} from 'express';
import fn = jest.fn;

describe('Health Check Controller', () => {
  const container = containerBuilder();
  const healthCheckController = container.get('healthCheckController') as HealthCheckController;

  test('run action Default', () => {
    const request = {} as Request;
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

    healthCheckController.actionDefault(request, response);

    expect(response.json).toBeCalledTimes(1);
  });
});
