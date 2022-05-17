import Configurator from './Configurator';
import {Credentials, S3} from 'aws-sdk';

export default class S3Connection {
  private readonly s3: S3;

  constructor (configurator: Configurator) {
    const { accessKeyId, secretAccessKey, session } = configurator.parameters('parameters.aws') as Record<string, string>;
    const { region, endpoint } = configurator.parameters('parameters.s3') as Record<string, string>;

    this.s3 = new S3({
      signatureVersion: 'v4',
      s3ForcePathStyle: true,
      region,
      endpoint,
      credentials: new Credentials(accessKeyId, secretAccessKey, session),
    });
  }

  getClient () {
    return this.s3;
  }

}
