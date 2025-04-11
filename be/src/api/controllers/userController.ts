import { NextFunction, Request, Response } from 'express';
import {
  deleteUserById,
  fetchAllUsers,
  findUserById,
  updateUserById,
} from '../../db/services/userService';
import { BadRequestError, NotFoundError } from '../error';
import { UserDTO } from '../types';
import { UserOutput } from '../../db/models/User';
import { IUserNoSensibleData } from '../interfaces';

interface UserRequest extends Request {
  body: UserDTO;
  params: { id: string };
}

export const getAllUsers = async (
  req: UserRequest,
  res: Response<UserDTO[]>
) => {
  const u: UserOutput[] = await fetchAllUsers();

  const uRes: IUserNoSensibleData[] = u.map((user: UserOutput) => {
    const userNoSensibleData: IUserNoSensibleData = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      userRole: user.userRole,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return userNoSensibleData;
  });
  res.status(200).send(uRes);
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
  const { id } = req.params;
  // 400 BAD REQUEST gestita dalla validazione openapi
  if (!id || isNaN(+id) || +id <= 0) {
    return next(new BadRequestError(`User ID must be positive integer`));
  }
  // FIXME - username unico - cercare se esiste o gestire l'eventuale errore di creazione
  // ipotesi fixme ok
  const u = await updateUserById(+id, req.body);
  if (!u) {
    return next(new NotFoundError(`User not found for ID ${id}`));
  }
  res.status(200).send(u);
};
