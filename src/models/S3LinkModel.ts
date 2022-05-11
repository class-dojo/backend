import BaseModel from './BaseModel';
import S3Connection from '../components/S3Connection';
import { S3 } from 'aws-sdk';

export default class S3LinkModel extends BaseModel {
  private s3Connection: S3;
  constructor (s3Connection: S3Connection) {
    super();
    this.s3Connection = s3Connection.getClient();
  }

  getLinks (images : string[]) {
    return {links: ['link1, link2']};
  }

}
