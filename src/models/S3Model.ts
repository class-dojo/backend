import BaseModel from './BaseModel';
import S3Connection from '../components/S3Connection';
import {S3} from 'aws-sdk';
import {Body, GetObjectRequest, ObjectList, PutObjectOutput, PutObjectRequest} from 'aws-sdk/clients/s3';

export default class S3Model extends BaseModel {
  private s3: S3;

  constructor (s3Client: S3Connection) {
    super();
    this.s3 = s3Client.getClient();
  }

  async get (bucket: string, key: string, params?: Omit<GetObjectRequest, 'Bucket'|'Key'>): Promise<string> {
    const response = await this.s3.getObject({
      Bucket: bucket,
      Key: key,
      ...params,
    }).promise();
    return response.Body.toString();
  }

  async put (bucket: string, key: string, body: Body, params?: Omit<PutObjectRequest, 'Bucket'|'Key'>): Promise<PutObjectOutput> {
    return await this.s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ...params,
    }).promise();
  }

  async listAllFiles (bucket: string, folder = ''): Promise<ObjectList> {
    const response = await this.s3.listObjectsV2({
      Bucket: bucket,
      Prefix: folder,
    }).promise();
    return response.Contents;
  }

  presignedPutLink (bucket: string, filename: string): string {
    return this.s3.getSignedUrl('putObject', {
      Bucket: bucket,
      Key: filename,
      Expires: 604800
    });
  }
}
