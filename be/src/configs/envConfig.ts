import dotenv from 'dotenv';

dotenv.config();

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;

export const DB_HOST = process.env.DATABASE_HOST;
export const DB_NAME = process.env.DATABASE_NAME;
export const DB_USER = process.env.DATABASE_USER;
export const DB_PASS = process.env.DATABASE_PASS;
