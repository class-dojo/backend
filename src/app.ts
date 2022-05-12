import express, {Express} from 'express';
import {ContainerBuilder, YamlFileLoader} from 'node-dependency-injection';
import {join} from 'path';
import Router from './Router';
import Configurator from './components/Configurator';
import RekognitionConnectionLocal from './components/RekognitionConnectionLocal';


// TODO: https://github.com/serverless/serverless-plugin-typescript/issues/188
// components
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Version from './components/Version';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import RekognitionConnection from './components/RekognitionConnection';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import S3Connection from './components/S3Connection';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

// controllers
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import HealthCheckController from './controllers/HealthCheckController';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import AnalyzeController from './controllers/AnalyzeController';

// models
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BaseModel from './models/BaseModel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ImageModel from './models/ImageModel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import RekognitionModel from './models/RekognitionModel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SentimentModel from './models/SentimentModel';

const srcDir = join(__dirname);
const container = new ContainerBuilder(true, srcDir);

const loader = new YamlFileLoader(container);
loader.load(__dirname + '/config/services.yml');

const configurator = container.get('configurator') as Configurator;
const environment = configurator.parameters('parameters.env');

// todo should be a factory https://github.com/zazoomauro/node-dependency-injection/wiki/Factory
if (environment !== 'prod') {
  container.set('rekognitionConnection', new RekognitionConnectionLocal(configurator));
}

// HAVE TO COMPILE AFTER SETTING SERVICES UP
container.compile();

const router: Router = new Router(container);

const app: Express = express();

app.use(express.json()); // json body parser
app.use('/', router.getRestRouter());

export default app;
