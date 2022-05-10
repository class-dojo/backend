import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

export default class Configurator {

  path = '';
  config = {} as any;
  mapping = {
    'S3_IMAGEBUCKETNAME': 'parameters.s3.imageBucketName',
    'S3_ENDPOINT': 'parameters.s3.endpoint',
  };


  constructor (configPath = '/../config/config.yml') {
    // this.config = yaml.load(fs.readFileSync(__dirname + configPath, 'utf8'));

  }

  selectAndApplyEnvParams () {
    // loop through mapping
    // check if each key exists in process.env
    // if yes, take this.config and replace value
    // this.config should have updated values at the end

    try {
      console.log(this.config.parameters.s3);
    } catch (err: any) {
      console.error(err.stack);
    }

    return;
  }

  parameters (name: string | null = null): string |  Record<string, string> {
    // do I have an argument?
    // if yes, return specific value / values in config tree
    // if no, return whole config

    return 'hello';
  }
}
