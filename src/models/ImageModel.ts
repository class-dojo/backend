import BaseModel from './BaseModel';
import Configurator from '../components/Configurator';
import {ObjectList} from 'aws-sdk/clients/s3';
import S3Model from './S3Model';

export default class ImageModel extends BaseModel {
  private readonly bucketName: string;

  constructor (private readonly s3Model: S3Model, configurator: Configurator) {
    super();
    this.bucketName = configurator.parameters('parameters.s3.bucketName') as string;
  }

  checkIfImagesExist (idsToCheck: string[]): Promise<boolean> {
    return this.s3Model.listAllFiles(this.bucketName)
      .then((data) => ImageModel.imagesExist(idsToCheck, data));
  }

  private static imagesExist (idsToCheck: string[], allFiles: ObjectList): boolean {
    const allKeys = [];
    for (const file of allFiles) {
      if (idsToCheck.includes(file.Key)) {
        allKeys.push(file.Key);
      }
    }

    return allKeys.length === idsToCheck.length;
  }


  storeFinalResults () {
    return;
  }
}
