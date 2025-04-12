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

// Lascia accedere solo admin
export const isAdmin = authorize([UserRoleEnum.ADMIN]);

// Lascia accedere employee o admin
export const isEmployee = authorize([
  UserRoleEnum.EMPLOYEE,
  UserRoleEnum.ADMIN,
]);

// Lascia accedere customer o employee o admin (tutti, basta avere JWT valido)
export const isCustomer = authorize([
  UserRoleEnum.CUSTOMER,
  UserRoleEnum.EMPLOYEE,
  UserRoleEnum.ADMIN,
]);
