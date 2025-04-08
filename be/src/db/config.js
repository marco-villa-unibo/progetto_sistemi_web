require('dotenv').config();
// const fs = require('fs');

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: process.env.DATABASE_DRIVER,
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  //   test: {
  //     username: process.env.CI_DB_USERNAME,
  //     password: process.env.CI_DB_PASSWORD,
  //     database: process.env.CI_DB_NAME,
  //     host: '127.0.0.1',
  //     port: 3306,
  //     dialect: 'mysql',
  //     dialectOptions: {
  //       bigNumberStrings: true,
  //     },
  //   },
  //   production: {
  //     username: process.env.PROD_DB_USERNAME,
  //     password: process.env.PROD_DB_PASSWORD,
  //     database: process.env.PROD_DB_NAME,
  //     host: process.env.PROD_DB_HOSTNAME,
  //     port: process.env.PROD_DB_PORT,
  //     dialect: 'mysql',
  //     dialectOptions: {
  //       bigNumberStrings: true,
  //       ssl: {
  //         ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt'),
  //       },
  //     },
  //   },
};
