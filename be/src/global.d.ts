import 'express';
import { User } from './models';

declare module 'express' {
  interface Request {
    userId?: number; // NOTE - provvisorio in attesa JWT
    timestamp?: number;
  }
}
