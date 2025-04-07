import express, { Application } from 'express';

import {
  addTimestamp,
  cors,
  errorHandler,
  logger,
  openApiValidator,
} from './api/middlewares';
import routes from './api/routes';

import dbInit from './db/init';
import dotenv from 'dotenv';

dotenv.config();

dbInit();

const PORT = process.env.PORT;

export const get = () => {
  const app: Application = express();

  // MIDDLEWARES
  app.use(express.json());
  app.use(addTimestamp);
  app.use(logger);
  app.use(openApiValidator);
  app.use(cors);

  // V1 ROUTES
  app.use('/api/v1', routes);

  // ERROR HANDLER
  app.use(errorHandler);

  return app;
};

export const start = () => {
  const app = get();

  try {
    app.listen(PORT, () => {
      console.log(`Shop api listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('ERROR OCCURRED :>> ', error);
  }
};

start();

//

//

// SEQUELIZE
// User.hasMany(Product);
// Product.belongsTo(User);

// sequelize
//   // .sync({force:true})
//   .sync()
//   .then(r => {
//     return User.findByPk(1);
//   })
//   .then(user => {
//     if (!user)
//       return User.create({
//         username: 'Prova',
//         firstName: 'Marco',
//         lastName: 'Villa',
//         email: 'prova@prova.com',
//         password: '12345678',
//         address: 'address',
//         userRole: 'ADMIN',
//       });
//     return user;
//   })
//   .then(user => {
//     // console.log('user :>> ', user);
//   })
//   .catch(err => {});
