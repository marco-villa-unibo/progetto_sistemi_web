import 'express';
import { User } from './models';

declare module 'express' {
  interface Request {
    userId?: number;
    timestamp?: number;
  }
}
