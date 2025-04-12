import { components } from '../schemas';
import { createEnumObjectFromType } from '../../utils/helpers';

// USER
export type UserDTO = components['schemas']['User'];
export type UserLoginDTO = components['schemas']['UserLogin'];
export type UserRegisterDTO = components['schemas']['UserRegister'];

// USER ROLE
export type UserRoleDTO = components['schemas']['UserRole'];

export const UserRoleEnum = createEnumObjectFromType<UserRoleDTO>({
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
});
