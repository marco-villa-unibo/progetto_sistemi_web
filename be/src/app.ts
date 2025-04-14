import express, { Application, Request, Response } from 'express';

import {
  addTimestamp,
  cors,
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

dotenv.config();

dbInit();

const PORT = process.env.PORT;

export const get = () => {
  const app: Application = express();

  // MIDDLEWARES
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.text());
  app.use(upload.single('image'));
  app.use(addTimestamp);
  app.use(logger);
  app.use(openApiValidator);
  app.use(cors);

  // STATIC SERVING
  app.use(
    '/images',
    express.static(path.join(__dirname, process.env.IMAGE_UPLOAD_FOLDER!))
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
