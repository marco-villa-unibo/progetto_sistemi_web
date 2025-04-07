import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  insertUser,
  modifyUser,
  removeUser,
} from '../controllers/userController';

export const userRouter = Router();

/**
 * @openapi
 *
 */
userRouter.get('/', getAllUsers);

/**
 * @openapi
 *
 */
userRouter.post('/', insertUser);

/**
 * @openapi
 *
 */
userRouter.put('/', modifyUser);

/**
 * @openapi
 *
 */
userRouter.get('/:id', getUserById);

/**
 * @openapi
 *
 */
userRouter.delete('/:id', removeUser);
