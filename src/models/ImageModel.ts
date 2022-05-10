import BaseModel from './BaseModel';
import S3Connection from '../components/S3Connection';
import Configurator from '../components/Configurator';
import {S3} from 'aws-sdk';
import {GetObjectRequest} from 'aws-sdk/clients/s3';

export default class ImageModel extends BaseModel {
  private s3: S3;
  private bucketName: string;

  constructor (s3Client: S3Connection, configurator: Configurator) {
    super();
    this.s3 = s3Client.getClient();
    this.bucketName = configurator.parameters('s3.imageBucketName') as string;
  }

  getImagesById (ids: string[]): string[] {
    return [];
  }

  getPresignedPutLink (filename: string): string {
    // this.s3.getSignedUrl();
    return 'hello';
  }

  storeFinalResults () {
    return;
  }

  private async get (bucket: string, key: string, params?: Omit<GetObjectRequest, 'Bucket'|'Key'>): Promise<string> {
    const response = await this.s3.getObject({
      Bucket: bucket,
      Key: key,
      ...params,
    }).promise();
    return response.Body.toString();
  }
}
