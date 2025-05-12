import express, { Application, Request, Response } from 'express';

import {
  addTimestamp,
  errorHandler,
  logger,
  openApiValidator,
  upload,
} from './api/middlewares';
import routes from './api/routes';

import dbInit from './db/init';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

dotenv.config();

dbInit();

const PORT = process.env.PORT;

export const get = () => {
  const app: Application = express();

  // CORS OPTIONS
  const corsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  // MIDDLEWARES
  app.use(cors(corsOptions));
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.text());
  app.use(upload.single('image'));
  app.use(addTimestamp);
  app.use(logger);
  app.use(openApiValidator);
  // app.use(cors);

  // STATIC SERVING
  app.use(
    express.static("public")
  );

  // HOME DIRECTIONS
  app.get('/', async (_req: Request, res: Response): Promise<void | any> => {
    return res.status(200).send({
      message: `Welcome to the SHOP API! \n Endpoints available at http://localhost:${PORT}/api/v1 or Swagger at http://localhost:${PORT}/api/v1/api-docs/`,
    });
  });

  // V1 ROUTES
  app.use('/api/v1', routes);

  // ERROR HANDLER
  app.use(errorHandler);

  return app;
};

export const start = () => {
  const app = get();

  try {
    app.listen(PORT, () => {
      console.log(`Shop api listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('ERROR OCCURRED :>> ', error);
  }
};

start();
