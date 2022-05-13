import BaseModel from './BaseModel';
import S3Model from './S3Model';
import Configurator from '../components/Configurator';

export default class S3LinkModel extends BaseModel {
  bucketName: string;
  constructor (private readonly s3Model: S3Model, configurator: Configurator) {
    super();
    this.bucketName = configurator.parameters('parameters.s3.bucketName');
  }

  getLinks (filenames: string[]): Record<string, string> {
    const allPresignedLinks: Record<string, string> = {};

    for (const filename of filenames) {
      allPresignedLinks[filename] = this.s3Model.presignedPutLink(this.bucketName, filename);
    }

    return Object.values(allPresignedLinks);
  }

}
