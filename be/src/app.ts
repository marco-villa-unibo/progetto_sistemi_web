import express, { Application } from 'express';

import { PORT } from './configs/envConfig';
import {
  addTimestamp,
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

// CORS - REST-API setting
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ROUTES
app.use('/api/v1/api-docs', apiDocsRouter);
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/product', productRouter);

// ERROR
app.use(errorHandler);

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Shop api listening at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.log('SEQUELIZE ERROR :>> ', err);
  });
