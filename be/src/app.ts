import express, { Application } from 'express';

import { PORT } from './configs/envConfig';
import {
  addTimestamp,
  cors,
  errorHandler,
  logger,
  openApiValidator,
} from './middlewares';
import { apiDocsRouter, healthRouter, productRouter } from './routes';
import { sequelize } from './utils/db';

const app: Application = express();

// MIDDLEWARES
app.use(express.json());
app.use(addTimestamp);
app.use(logger);
app.use(openApiValidator);
app.use(cors);

// ROUTES
app.use('/api/v1/api-docs', apiDocsRouter);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/product', productRouter);

// ERROR HANDLER
app.use(errorHandler);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Shop api listening at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log('SEQUELIZE ERROR :>> ', err);
  });
