import { NextFunction, Request, Response } from 'express';
import {
  deleteUserById,
  fetchAllUsers,
  findUserById,
  updateUserById,
} from '../../db/services/userService';
import { BadRequestError, ForbiddenError, NotFoundError } from '../error';
import { UserDTO, UserRoleDTO } from '../types';
import { UserOutput } from '../../db/models/User';
import { IUserNoSensibleData } from '../interfaces';

interface UserRequest extends Request {
  body: UserDTO;
  params: { id: string };
}

export const getAllUsers = async (
  req: UserRequest,
  res: Response<UserDTO[]>,
  next: NextFunction
) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: UserRequest,
  res: Response<UserDTO>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (isNaN(+id) || +id <= 0) {
      return next(new BadRequestError(`User ID must be positive integer`));
    }

    const u = await findUserById(+id);
    if (!u) {
      return next(new NotFoundError(`User not found for ID ${id}`));
    }
    res.status(200).send(u);
  } catch (error) {
    next(error);
  }
};

export const removeUser = async (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (isNaN(+id) || +id <= 0) {
      return next(new BadRequestError(`User ID must be positive integer`));
    }

    const u = await deleteUserById(+id);
    if (!u) {
      return next(new NotFoundError(`User not found for ID ${id}`));
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

interface ModifyUserRequest extends Request {
  body: { userDTO: UserDTO; userRole: UserRoleDTO };
  params: { id: string };
}

export const modifyUser = async (
  req: ModifyUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(+id) || +id <= 0) {
      return next(new BadRequestError(`User ID must be positive integer`));
    }

    if (!req.user) {
      return next(
        new ForbiddenError('User ID from token is missing or invalid')
      );
    }

    const userIdFromToken = req.user.userId;
    const userRoleFromToken = req.user.role;

    if (userRoleFromToken !== 'ADMIN' && +id !== userIdFromToken) {
      return next(
        new ForbiddenError(
          'You are not authorized to modify this user. Only admins can modify other users.'
        )
      );
    }

    if (
      userRoleFromToken !== 'ADMIN' &&
      userRoleFromToken !== req.body.userRole
    ) {
      return next(
        new BadRequestError('You are not allowed to change the user role.')
      );
    }

    const u = await updateUserById(+id, req.body);
    if (!u) {
      return next(new NotFoundError(`User not found for ID ${id}`));
    }
    res.status(200).send(u);
  } catch (error) {
    next(error);
  }
};
