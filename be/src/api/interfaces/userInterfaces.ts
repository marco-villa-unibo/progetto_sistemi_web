import { UserDTO, UserRoleDTO } from '../types';

// DTO per i dati dell'utente da includere nel JWT (payload)
export interface IUserJwtPayload {
  userId: number;
  username: string;
  email: string;
  role: UserRoleDTO;
}

export interface IUserNoSensibleData extends UserDTO {
  id: number;
  userRole: UserRoleDTO;
  createdAt?: Date;
  updatedAt?: Date;
}
