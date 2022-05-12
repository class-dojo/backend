import {describe, test} from '@jest/globals';
import ImageModel from '../../src/models/ImageModel';
import {containerBuilder} from '../testContainer';
import Configurator from '../../src/components/Configurator';
import S3Model from '../../src/models/S3Model';

describe('ImageModel', () => {

  test('should get list of all existing images', async () => {
    const container = containerBuilder();
    const imageModel = container.get('imageModel') as ImageModel;
    const s3Model = container.get('s3Model') as S3Model;
    const configurator = container.get('configurator') as Configurator;
    const imageBucketName = configurator.parameters('parameters.s3.bucketName');

    const image1 = s3Model.put(imageBucketName, 'testVideo/image.jpg', '');
    const image2 = s3Model.put(imageBucketName, 'testVideo/image2.jpg', '');

    await Promise.all([image1, image2]);

    // this is how you mock unit tests
    // const s3Client = {} as S3Connection;
    // const configurator = {} as Configurator;
    // const imageModel = new ImageModel(s3Client, configurator);

    const listOfImages = await imageModel.fetchImagesNames('testVideo');

    expect(listOfImages[0].Key).toBe('testVideo/image.jpg');
    expect(listOfImages[1].Key).toBe('testVideo/image2.jpg');
  });
});
