import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import S3LinkModel from '../../src/models/S3LinkModel';

describe('S3 Links model', () => {
  const container = containerBuilder();
  const s3LinkModel = container.get('s3LinkModel') as S3LinkModel;

  test('should get Links', () => {
    const links: string[] = s3LinkModel.getLinks(['testVideo/image.jpg', 'testVideo/image2.jpg']);
    // todo fix tests when we return key value pair
    // const keys = Object.keys(links);
    expect(links).toHaveLength(2);
    // expect(keys).toEqual(['testVideo/image1.jpg', 'testVideo/image2.jpg']);
  });
});
