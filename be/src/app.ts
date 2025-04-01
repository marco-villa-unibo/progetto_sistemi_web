import express, { Application } from 'express';

import { PORT } from './configs/envConfig';
import {
  addTimestamp,
  errorHandler,
  logger,
  openApiValidator,
} from './middlewares';
import { apiDocsRouter } from './routes';

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
app.use('/api-docs', apiDocsRouter);

// ERROR
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
