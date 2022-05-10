import {ContainerBuilder} from 'node-dependency-injection';
import {Router as ExpressRouter} from 'express';

const controllers = [
  'healthCheckController',
  'analyzeController'
];

export default class Router {
  router: ExpressRouter;

  constructor (container: ContainerBuilder) {
    this.router = ExpressRouter();

    controllers.forEach((controller: string) => {
      container.get(controller).register(this.router);
    });
  }

  getRestRouter (): ExpressRouter {
    return this.router;
  }
}
