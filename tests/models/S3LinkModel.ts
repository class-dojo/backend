import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';

describe('Sentiment model', () => {
  const container = containerBuilder();
  const s3LinkModel = container.get('s3LinkModel');
  const links: string[] = s3LinkModel.getLinks(['testVideo/image1.jpg', 'testVideo/image2.jpg']);

  test('should get Links', () => {
    const keys = Object.keys(links);
    expect(keys).toHaveLength(2);
    expect(keys).toEqual(['testVideo/image1.jpg', 'testVideo/image2.jpg']);
  });
});
