import { components } from '../schemas';
import { createEnumObjectFromType } from '../utils/helpers';

export type UserRoleDto = components['schemas']['UserRole'];

export const UserRoleEnum = createEnumObjectFromType<UserRoleDto>({
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  EMPLOYEE: 'EMPLOYEE',
});
