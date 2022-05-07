export default class Version {
  path = '';

  constructor (path: string) {
    this.path = path;
  }

  getVersion () {
    return 1;
  }

  isStable () {
    return true;
  }


}
