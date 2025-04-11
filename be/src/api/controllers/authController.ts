import { NextFunction, Request, Response } from 'express';
import {
  register as registerService,
  login as loginService,
} from '../../db/services/authService';
import { UserInput } from '../../db/models/User';
import { BadRequestError, UnauthorizedError } from '../error';
import { UserLoginDTO } from '../types';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userInput: UserInput = req.body;
  const newUser = await registerService(userInput);
  if (!newUser) {
    return next(new BadRequestError(`User Already existing`));
  }
  res.status(201).send(newUser);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userLogin: UserLoginDTO = req.body;
  const u = await loginService(userLogin);
  if (!u) {
    return next(new UnauthorizedError(`Wrong username or password.`));
  }

  res.status(200).send(u);
};
