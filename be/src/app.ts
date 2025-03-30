import express, { Application } from 'express';

import { PORT } from './util/config';

const app: Application = express();

// BODY-PARSE
app.use(express.json());

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

app.listen(PORT);
