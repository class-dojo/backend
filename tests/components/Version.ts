import {describe, test, expect} from '@jest/globals';
import * as fs from 'fs';

import Version from '../../src/components/Version';

const STAGING_VERSION = 'VERSION=v1.3.273-14-gae71e82\n' +
	'BUILD_DATE=2020-03-03T12:33:03Z\n';

const PRODUCTION_VERSION = 'VERSION=v1.3.273\n' +
	'BUILD_DATE=2020-03-03T12:31:03Z\n';

const PATH = __dirname, FILE = PATH + '/version.txt';

describe('Version', () => {

  test('Dev version', () => {
    const version = new Version(PATH);

    expect(version.getVersion()).toEqual('dev');
    expect(version.isStable()).toBeFalsy();
  });

  test('Staging version', () => {
    fs.writeFileSync(FILE, STAGING_VERSION);
    const version = new Version(PATH);

    expect(version.getVersion()).toEqual('v1.3.273-14-gae71e82');
    expect(version.isStable()).toBeFalsy();

    fs.unlinkSync(FILE);
  });

  test('Production version', () => {
    fs.writeFileSync(FILE, PRODUCTION_VERSION);
    const version = new Version(PATH);

    expect(version.getVersion()).toEqual('v1.3.273');
    expect(version.isStable()).toBeTruthy();

    fs.unlinkSync(FILE);
  });
});

describe('Version', () => {

  test('Dev version', () => {
    const version = new Version(PATH);

    expect(version.getVersion()).toEqual('dev');
    expect(version.isStable()).toBeFalsy();
  });

  test('Staging version', () => {
    fs.writeFileSync(FILE, STAGING_VERSION);
    const version = new Version(PATH);

    expect(version.getVersion()).toEqual('v1.3.273-14-gae71e82');
    expect(version.isStable()).toBeFalsy();

    fs.unlinkSync(FILE);
  });

  test('Production version', () => {
    fs.writeFileSync(FILE, PRODUCTION_VERSION);
    const version = new Version(PATH);

    expect(version.getVersion()).toEqual('v1.3.273');
    expect(version.isStable()).toBeTruthy();

    fs.unlinkSync(FILE);
  });
});
