import {ContainerBuilder, YamlFileLoader} from 'node-dependency-injection';
import {join} from 'path';

export const containerBuilder = (): ContainerBuilder => {
  const srcDir = join(__dirname, '../src');
  const container = new ContainerBuilder(true, srcDir);

  const loader = new YamlFileLoader(container);
  loader.load(__dirname + '/../src/config/services.yml');

  // mock services
  // container.set('rekognitionConnection', new RekognitionConnectionMock());

  container.compile();

  return container;
};
