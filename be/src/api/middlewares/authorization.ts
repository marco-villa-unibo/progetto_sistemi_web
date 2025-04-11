import { Request, Response, NextFunction } from 'express';
import { UserRoleDTO, UserRoleEnum } from '../../api/types';
import { ForbiddenError } from '../error';

export const authorize = (roles: UserRoleDTO[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
      return next(); // L'utente ha uno dei ruoli richiesti, accesso consentito
    } else {
      return next(
        new ForbiddenError(
          `Non hai i permessi necessari per accedere a questa risorsa.`
        )
      );
    }
  };
};

// Middleware specifici per i ruoli comuni:
export const isAdmin = authorize([UserRoleEnum.ADMIN]);

export const isEmployee = authorize([
  UserRoleEnum.EMPLOYEE,
  UserRoleEnum.ADMIN,
]); // Gli employee possono accedere se sono employee O admin

export const isCustomer = authorize([
  UserRoleEnum.CUSTOMER,
  UserRoleEnum.EMPLOYEE,
  UserRoleEnum.ADMIN,
]); // I customer possono accedere se sono customer, employee O admin
