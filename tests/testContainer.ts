import {ContainerBuilder, YamlFileLoader} from 'node-dependency-injection';
import {join} from 'path';
import RekognitionConnectionLocal from '../src/components/RekognitionConnectionLocal';
import Configurator from '../src/components/Configurator';

export const containerBuilder = (): ContainerBuilder => {
  const srcDir = join(__dirname, '../src');
  const container = new ContainerBuilder(true, srcDir);

  const loader = new YamlFileLoader(container);
  loader.load(__dirname + '/../src/config/services.yml');

  // mock services
  // container.set('rekognitionConnection', new RekognitionConnectionMock());

  const configurator = container.get('configurator') as Configurator;
  const local = new RekognitionConnectionLocal(configurator);
  container.set('rekognitionConnection', local);

  container.compile();
  return container;
};
