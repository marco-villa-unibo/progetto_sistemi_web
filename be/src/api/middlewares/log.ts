import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log('Content-Type:', req.headers['content-type']);
  console.log(`${req.timestamp} ${req.method} ${req.ip}${req.originalUrl}`);
  next();
}
