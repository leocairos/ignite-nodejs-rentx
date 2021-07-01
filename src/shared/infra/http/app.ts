import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import '@shared/container';

import upload from '@config/upload';
import { AppError } from '@shared/errors/AppError';
import { router } from '@shared/infra/http/routes';
import createConnection from '@shared/infra/typeorm';

import swaggerFile from '../../../swagger.json';

createConnection();

const app = express();

app.use(cors());
app.use(express.json());

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'RentX API',
  // customfavIcon: '/assets/favicon.ico',
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, options));

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`));
app.use('/cars', express.static(`${upload.tmpFolder}/cars`));

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: 'error',
      message: `Internal server error - ${err.message}`,
    });
  },
);

export { app };
