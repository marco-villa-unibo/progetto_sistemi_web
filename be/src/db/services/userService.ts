import { NotFoundError } from '../../api/error';
import User, { UserOutput } from '../models/User';

export const findUserById = async (id: number): Promise<UserOutput | null> => {
  User.create;

  return await User.findByPk(id);
};
