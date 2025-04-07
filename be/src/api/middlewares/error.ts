import { Request, Response, NextFunction } from 'express';
import { ErrorDTO } from '../types';
import { HttpError } from '../error/http';

export function errorHandler(
  err: any,
  req: Request,
  res: Response<ErrorDTO>,
  next: NextFunction
) {
  console.error(err.stack);

  res
    .status(err.status || 500)
    .send({ message: err.message || 'Internal Server Error' });
}
