import BaseModel from './BaseModel';
import Configurator from '../components/Configurator';
import {ObjectList} from 'aws-sdk/clients/s3';
import S3Model from './S3Model';
import { IFinalResponse } from './interface';

export default class ImageModel extends BaseModel {
  private readonly bucketName: string;

  constructor (private readonly s3Model: S3Model, configurator: Configurator) {
    super();
    this.bucketName = configurator.parameters('parameters.s3.bucketName') as string;
  }

  async fetchImagesNames (videoUid: string): Promise<ObjectList> {
    return await this.s3Model.listAllFiles(this.bucketName, videoUid);
  }

  async storeFinalResults (dataAfterMagic: IFinalResponse, videoUid: string) {
    //upload dataAfterMagic.stringify to s3
    try {
      await this.s3Model.put(this.bucketName, `results/${videoUid}.json`, JSON.stringify(dataAfterMagic));
    } catch (err) {
      throw new Error('Results not uploaded to S3');
      console.error(err);
    }
  }
}
