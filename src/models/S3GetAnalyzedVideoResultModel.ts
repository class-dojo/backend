import BaseModel from './BaseModel';
import S3Model from './S3Model';
import Configurator from '../components/Configurator';

export default class S3GetAnalyzedVideoResultModel extends BaseModel {
  bucketName: string;
  constructor (private readonly s3Model: S3Model, configurator: Configurator) {
    super();
    this.bucketName = configurator.parameters('parameters.s3.bucketName');
  }

  async getResult (path: string): Promise<any> {
    return await this.s3Model.get(this.bucketName, `results/${path}.json`);
  }

}
