import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import HealthCheckController from '../../src/controllers/HealthCheckController';
import {Request, Response} from 'express';

describe('Health Check Controller', () => {
  const container = containerBuilder();
  const healthCheckController = container.get('healthCheckController') as HealthCheckController;

  test('run action Default', () => {
    const request = {} as Request;
    const response = {} as Response;
    healthCheckController.actionDefault(request, response);

    expect(response).toBe({
      status: 'Healthy',
      versionInfo: 1,
      stable: true,
    });
  });
});
