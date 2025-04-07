import dotenv from 'dotenv';
import { sequelizeConnection } from './dbConfig';

import { Product, User } from './models';

dotenv.config();

const isDev = process.env.NODE_ENV === 'dev';
const isTest = process.env.NODE_ENV === 'test';

User.hasMany(Product);
Product.hasOne(User);

const dbInit = async () => {
  try {
    await sequelizeConnection.sync({ force: false });
    console.log('DATABASE CONNECTED');
  } catch (error) {
    console.log(' DATABASE INIT ERROR :>> ', error);
  }
};
// const dbInit = () =>
//   Promise.all([
//     Product.sync({ alter: isDev || isTest }),
//     User.sync({ alter: isDev || isTest }),
//   ]);

export default dbInit;
