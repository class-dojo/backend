import serverlessExpress from '@vendia/serverless-express';
import app from './src/app';

const handler = serverlessExpress({ app });

exports.handler = handler;
