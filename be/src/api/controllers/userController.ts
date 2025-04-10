import { NextFunction, Request, Response } from 'express';
import {
  createUser,
  deleteUserById,
  fetchAllUsers,
  findUserById,
  updateUserById,
} from '../../db/services/userService';
import { BadRequestError, NotFoundError } from '../error';
import { UserDTO } from '../types';
import { UserOutput } from '../../db/models/User';

interface UserRequest extends Request {
  body: UserDTO;
  params: { id: string };
}

export const insertUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  // FIXME - username unico - cercare se esiste o gestire l'eventuale errore di creazione
  // ipotesi fixme ok
  // forzo il ruolo a customer
  // in caso di utenza diversa usare endpoint apposito
  //   const user: UserDTO = {
  //     ...req.body,
  //     userRole: 'CUSTOMER',
  //   };
  //   const u: UserOutput = await createUser(user);
  //   res.status(200).send(u);
};

export const getAllUsers = async (
  req: UserRequest,
  res: Response<UserDTO[]>
) => {
  //   const u: UserDTO[] = await fetchAllUsers();
  //   res.status(200).send(u);
};

export const getUserById = async (
  req: UserRequest,
  res: Response<UserDTO>,
  next: NextFunction
) => {
  const { id } = req.params;

  // TODO: trasferire controllo a validazione yaml
  if (isNaN(+id) || +id <= 0) {
    return next(new BadRequestError(`User ID must be positive integer`));
  }

  const u = await findUserById(+id);
  if (!u) {
    return next(new NotFoundError(`User not found for ID ${id}`));
  }
  res.status(200).send(u);
};

export const removeUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  // TODO: trasferire controllo a validazione yaml
  if (isNaN(+id) || +id <= 0) {
    return next(new BadRequestError(`User ID must be positive integer`));
  }

  const u = await deleteUserById(+id);
  if (!u) {
    return next(new NotFoundError(`User not found for ID ${id}`));
  }

  res.status(204).end();
};

export const modifyUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  // const { id } = req.body;
  // // 400 BAD REQUEST gestita dalla validazione openapi
  // // TODO: trasferire controllo a validazione yaml
  // if (!id || isNaN(id) || id <= 0) {
  //   return next(new BadRequestError(`User ID must be positive integer`));
  // }
  // // FIXME - username unico - cercare se esiste o gestire l'eventuale errore di creazione
  // // ipotesi fixme ok
  // const u = await updateUserById(id, req.body);
  // if (!u) {
  //   return next(new NotFoundError(`User not found for ID ${id}`));
  // }
  // res.status(200).send(u);
};
