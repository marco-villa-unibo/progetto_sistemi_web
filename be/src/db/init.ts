import dotenv from 'dotenv';

import { Product, User } from './models';

dotenv.config();

const isDev = process.env.NODE_ENV === 'dev';
const isTest = process.env.NODE_ENV !== 'test';

const dbInit = () =>
  Promise.all([
    Product.sync({ alter: isDev || isTest }),
    User.sync({ alter: isDev || isTest }),
  ]);

export default dbInit;
