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

    const image1 = s3Model.put(imageBucketName, 'image.jpg', '');
    const image2 = s3Model.put(imageBucketName, 'image2.jpg', '');

    await Promise.all([image1, image2]);

    console.log('config');
    console.log(configurator.parameters());

    console.log('env');
    console.log(process.env);

    // this is how you mock unit tests
    // const s3Client = {} as S3Connection;
    // const configurator = {} as Configurator;
    // const imageModel = new ImageModel(s3Client, configurator);

    const outputTrue = await imageModel.checkIfImagesExist(['image.jpg', 'image2.jpg']);
    const outputFalse = await imageModel.checkIfImagesExist(['image.jpg', 'image3.jpg']);

    expect(outputTrue).toBe(true);
    expect(outputFalse).toBe(false);
  });
});
