import path from 'path';
import fs from 'fs';

export default class Configurator {

  path = '';

  constructor (configPath = '../../config/config.yml') {
    this.path = configPath;

  }
  selectAndApplyEnvParams () {
    return;
  }

  parameters (name: string | null = null) {


    return {};
  }
}
