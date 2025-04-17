import { NextFunction, Request, Response } from 'express';
import {
  register as registerService,
  login as loginService,
} from '../../db/services/authService';
import { UserInput } from '../../db/models/User';
import { BadRequestError, UnauthorizedError } from '../error';
import { UserLoginDTO } from '../types';
import { mailingService } from '@/src/utils/mail';

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
  // Send confirmation e-mail to the user
  // mailingService(
  //   newUser.email,
  //   'WELCOME to the Shop!',
  //   '<h1>WELCOME</h1><br> You successfully subscribed to the Shop!'
  // );
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
