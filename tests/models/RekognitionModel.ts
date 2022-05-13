import {describe, test} from '@jest/globals';
import {containerBuilder} from '../testContainer';
import RekognitionModel from '../../src/models/RekognitionModel';


describe('Rekognition Model', () => {

  test('should detect faces', async () => {
    const container = containerBuilder();
    const rekognitionModel = container.get('rekognitionModel') as RekognitionModel;

    const output4 = await rekognitionModel.detectFaces('rekogTest/image.jpg');
    expect(output4.FaceDetails).toHaveLength(4); // this is because of mock data showing 4 faces!
    const output3 = await rekognitionModel.detectFaces('rekogTest/image2.jpg');
    expect(output3.FaceDetails).toHaveLength(3); // this is because of mock data showing 3 faces!
  });
});
