import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

//Database
const DB_NAME = isTest
  ? (process.env.DATABASE_NAME_TEST as string)
  : (process.env.DATABASE_NAME as string);
const DB_USER = process.env.DATABASE_USER as string;
const DB_HOST = process.env.DATABASE_HOST;
const DB_DRIVER = process.env.DATABASE_DRIVER as Dialect;
const DB_PASS = process.env.DATABASE_PASS;

export const sequelizeConnection = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DRIVER,
  logging: true, // differenziare ambienti dev - test
});
