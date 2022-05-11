import app from './src/app';
// import swaggerUi from 'swagger-ui-express';
// import yaml from 'js-yaml';
// import fs from 'fs';


// no need for env variable as this is only needed for local dev
const PORT = 5000;
// const configPath = '/src/config/openapi.yml';
// const openapi = yaml.load(fs.readFileSync(__dirname + configPath, 'utf8'));
//
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.listen(PORT, () => {  // initialize server
  console.log(`I am up and running at http://localhost:${PORT}`);
});
