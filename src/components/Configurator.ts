import fs from 'fs';
import * as yaml from 'js-yaml';
import {mergeDeep} from './utils';

export default class Configurator {

  path = '';
  config: any = {};
  mapping = {
    'S3_BUCKETNAME': 'parameters.s3.bucketName',
    'S3_ENDPOINT': 'parameters.s3.endpoint',
    'AWS_ACCESS_KEY_ID': 'parameters.aws.accessKeyId',
    'AWS_SECRET_ACCESS_KEY': 'parameters.aws.secretAccessKey',
    'ENV': 'parameters.env'
  };


  constructor (configPath = '/../config/config.yml') {

    // console.log('who are you and what have you done to yaml', yaml);

    this.config = yaml.load(fs.readFileSync(__dirname + configPath, 'utf8'));
    this.selectAndApplyEnvParams();
  }

  selectAndApplyEnvParams () {
    // loop through mapping
    const envConfig: any = {};
    for (const [envVariable, configVariable] of Object.entries(this.mapping)) {
      // check if each key exists in process.env
      if (process.env[envVariable]) {
        let envValue: string | boolean = process.env[envVariable];

        // deal with booleans
        if (envValue === 'true' || envValue === 'false') {
          envValue = (envValue === 'true');
        }

        const paramsPath = configVariable.split('.');

        //if only one param, then can save straight
        if (paramsPath.length === 1) {
          envConfig[configVariable] = envValue;
        } else {
          const firstKey = paramsPath[0];
          // if key already exists, need to keep the previous values
          envConfig[firstKey] = (firstKey in envConfig) ? {...envConfig[firstKey]} : {};

          // pointer
          let current = envConfig[firstKey];

          // add all the other keys
          for (const key of paramsPath.slice(1)) {
            // if last then assign value
            if (key === paramsPath[paramsPath.length - 1]) {
              current[key] = envValue;

            } else {
              // check if key exists
              current[key] = (key in current) ? {...current[key]} : {};
            }
            // move pointer one level
            current = current[key];
          }
        }
      }
    }
    // merge the two configs together
    mergeDeep(this.config, envConfig);
  }

  parameters (name: string | null = null): any {
    // do I have an argument?
    if (name) {
      // if yes, return specific value / values in config tree
      const pathKeys = name.split('.');
      let value = this.config;
      for (const key of pathKeys) {
        value = value[key];
      }

      return value;
    }

    // if no, return whole config
    return this.config;
  }
}
