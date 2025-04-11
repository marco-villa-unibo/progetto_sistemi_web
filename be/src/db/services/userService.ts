import User, { UserInput, UserOutput } from '../models/User';

export const updateUserById = async (
  id: number,
  payload: Partial<UserInput>
): Promise<UserOutput | null> => {
  const user = await User.findByPk(id);

  if (!user) return null;

  return await user.update(payload);
};

export const findUserById = async (id: number): Promise<UserOutput | null> => {
  return await User.findByPk(id);
};

export const deleteUserById = async (id: number): Promise<boolean> => {
  const numDeletedUsers = await User.destroy({
    where: { id },
  });

  return !!numDeletedUsers;
};

export const fetchAllUsers = async (): Promise<UserOutput[]> => {
  return User.findAll();
};

// export const fetchAllUsers = async (
//   filters: GetAllUsersFilters
// ): Promise<UserOutput[]> => {
//   return User.findAll({
//     where: {
//       ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
//     },
//     ...((filters?.isDeleted || filters?.includeDeleted) && { paranoid: true }),
//   });
// };

// TODO - cambio di ruolo di un user
