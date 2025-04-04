import { Request, Response, NextFunction } from 'express';
import { ErrorDto } from '../types';
import { HttpError } from '../error/http';

export function errorHandler(
  err: any,
  req: Request,
  res: Response<ErrorDto>,
  next: NextFunction
): void {
  console.error(err.stack);

  // Controlla se l'errore è di tipo HttpError, se sì usa il codice di stato
  if (err instanceof HttpError) {
    console.log(
      `Errore tipo HttpError, stato: ${err.status}, messaggio: ${err.message}`
    );
    res.status(err.status).send({ message: err.message });
  } else {
    // Per gli altri errori non personalizzati
    console.log('Errore sconosciuto: ', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}
