// import mysql from 'mysql2';
// import { DB_HOST, DB_NAME, DB_USER, DB_PASS } from '../configs/envConfig';

// const poolConnection = mysql.createPool({
//   host: DB_HOST,
//   user: DB_USER,
//   database: DB_NAME,
//   password: DB_PASS,
// });

// export const pool = poolConnection.promise();

import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_USER, DB_PASS } from '../configs/envConfig';

export const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASS, {
  dialect: 'mysql',
  host: DB_HOST,
});
