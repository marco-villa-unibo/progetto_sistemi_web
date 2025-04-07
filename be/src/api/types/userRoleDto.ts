import { components } from '../schemas';
import { createEnumObjectFromType } from '../../utils/helpers';

export type UserRoleDTO = components['schemas']['UserRole'];

export const UserRoleEnum = createEnumObjectFromType<UserRoleDTO>({
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
});
