import {describe, test} from '@jest/globals';
import ImageModel from '../../src/models/ImageModel';
import {containerBuilder} from '../testContainer';
import Configurator from '../../src/components/Configurator';
import S3Model from '../../src/models/S3Model';
import RekognitionModel from '../../src/models/RekognitionModel';

describe('Rekognition Model', () => {

  test('should detect faces', async () => {
    const container = containerBuilder();
    // const imageModel = container.get('imageModel') as ImageModel;
    // const s3Model = container.get('s3Model') as S3Model;
    // const configurator = container.get('configurator') as Configurator;
    // const imageBucketName = configurator.parameters('parameters.s3.bucketName');

    const rekognitionModel = container.get('rekognitionModel') as RekognitionModel;
    const output = rekognitionModel.detectFaces('rekogTest/image.jpg');

    expect(output).toBe(1);

  });
});
