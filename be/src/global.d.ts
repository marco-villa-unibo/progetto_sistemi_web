import 'express';
import { IUserJwtPayload } from './api/interfaces';

declare module 'express' {
  interface Request {
    user?: IUserJwtPayload;
    timestamp?: number;
  }
}
