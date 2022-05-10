import {describe, test} from '@jest/globals';
import ImageModel from '../../src/models/ImageModel';
import {containerBuilder} from '../testContainer';
import S3Connection from '../../src/components/S3Connection';
import Configurator from '../../src/components/Configurator';
import S3Model from '../../src/models/S3Model';

describe('ImageModel', () => {

  const s3ListAllResponse = [
    {
      Key: 'verycoolcall/image.jpg',
      LastModified: '2022-05-10T17:51:22.728Z',
      ETag: '"e479b5af68201d819b596c44829941bb"',
      ChecksumAlgorithm: [] as any[],
      Size: 1674447,
      StorageClass: 'STANDARD',
      Owner: {
        DisplayName: 'minio',
        ID: '02d6176db174dc93cb1b899f7c6078f08654445fe8cf1b6ce98d8855f66bdbf4'
      }
    },
    {
      Key: 'verycoolcall/image2.jpg',
      LastModified:'2022-05-10T17:51:22.648Z',
      ETag: '"cbb9a6f92832938b2bcc858ea1fd2c43"',
      ChecksumAlgorithm: [],
      Size: 1604152,
      StorageClass: 'STANDARD',
      Owner: {
        DisplayName: 'minio',
        ID: '02d6176db174dc93cb1b899f7c6078f08654445fe8cf1b6ce98d8855f66bdbf4'
      }
    }];

  test('should get list of all existing images', async () => {
    const container = containerBuilder();
    const imageModel = container.get('imageModel') as ImageModel;
    const s3Model = container.get('s3Model') as S3Model;
    const configurator = container.get('configurator') as Configurator;
    const imageBucketName = configurator.parameters('parameters.s3.bucketName');

    const image1 = s3Model.put(imageBucketName, 'image.jpg', '');
    const image2 = s3Model.put(imageBucketName, 'image2.jpg', '');

    await Promise.all([image1, image2]);

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
