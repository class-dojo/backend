import express, {Express} from 'express';
import {ContainerBuilder, YamlFileLoader} from 'node-dependency-injection';
import {join} from 'path';
import Router from './Router';
import Configurator from './components/Configurator';
import RekognitionConnectionLocal from './components/RekognitionConnectionLocal';


const srcDir = join(__dirname);
const container = new ContainerBuilder(true, srcDir);

const loader = new YamlFileLoader(container);
loader.load(__dirname + '/config/services.yml');

const configurator = container.get('configurator') as Configurator;
const environment = configurator.parameters('env');

// todo should be a factory https://github.com/zazoomauro/node-dependency-injection/wiki/Factory
if (environment !== 'prod') {
  console.log('ENVIRONMENT PRINTING', environment);
  container.set('rekognitionConnection', new RekognitionConnectionLocal(configurator));
}

// HAVE TO COMPILE AFTER SETTING SERVICES UP
container.compile();

const router: Router = new Router(container);

const app: Express = express();

app.use(express.json()); // json body parser
app.use('/', router.getRestRouter());

export default app;
