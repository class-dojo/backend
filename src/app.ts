import express, {Express} from 'express';
import {ContainerBuilder, YamlFileLoader} from 'node-dependency-injection';
import {join} from 'path';
import Router from './Router';


const srcDir = join(__dirname);
const container = new ContainerBuilder(true, srcDir);

const loader = new YamlFileLoader(container);
loader.load(__dirname + '/config/services.yml');

container.compile();

const router: Router = new Router(container);

const app: Express = express();

app.use(express.json()); // json body parser
app.use('/', router.getRestRouter());
//
export default app;
