import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt';
import { Unauthorized } from '../error/unauthorized';

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const decodedToken = verifyToken(token);

    if (decodedToken) {
      req.user = decodedToken; // Aggiunge i dati dell'utente alla request
      next();
    } else {
      return next(new Unauthorized(`Token non valido.`));
    }
  } else {
    return next(new Unauthorized(`Token di autenticazione mancante.`));
  }
};

// TODO - implementare la divisione per i ruoli
