import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { router } from './routes';
import swaggerFile from './swagger.json';

import './database';

const app = express();

app.use(express.json());

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'RentalX API',
  // customfavIcon: '/assets/favicon.ico',
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

app.use(router);

app.listen(3333, () => console.log('Server is running!'));
