import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import ManipulateDataController from '../../src/controllers/ManipulateDataController';
import {Request, Response} from 'express';
import * as mockResponse from '../mockResponses/mockResponse1.json';
import fn = jest.fn;

describe('Test Controller', () => {
  const container = containerBuilder();
  const manipulateDataController = container.get('ManipulateDataController') as ManipulateDataController;

  test('run action Default', () => {

    const request = {
      body: mockResponse
    } as Request;
    const response = {
      json: fn((data) => {
        expect(data).toStrictEqual({
          'amountOfPeople': 4,
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

    manipulateDataController.actionDefault(request, response);

    expect(response.json).toBeCalledTimes(1);
  });
});
