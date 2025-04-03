import mysql from 'mysql2';
import { DB_HOST, DB_NAME, DB_USER, DB_PASS } from '../configs/envConfig';

const poolConnection = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASS,
});

export const pool = poolConnection.promise();
