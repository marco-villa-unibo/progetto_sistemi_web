import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User, { UserInput, UserOutput } from '../models/User';
import { generateToken } from '../../utils/jwt';
import { IUserJwtPayload } from '../../api/interfaces';
import { UserLoginDTO, UserRegisterDTO } from '../../api/types';

const SALT_ROUNDS = 10;

export const register = async (
  registerDto: UserRegisterDTO
): Promise<UserOutput | null> => {
  const { username, email, password } = registerDto;

  // Verifica se l'username o l'email esistono già
  const existingUser = await User.findOne({
    where: { [Op.or]: [{ username }, { email }] },
  });
  if (existingUser) return null;

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // User can register only with CUSTOMER role (it can be later updated by an admin)
  const newUser = await User.create({
    ...registerDto,
    passwordHash,
    userRole: 'CUSTOMER',
  });

  const u: UserOutput = {
    id: newUser.id,
    username: newUser.username,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phone: newUser.phone,
    address: newUser.address,
    userRole: newUser.userRole,
  };
  return u;
};

export const login = async (
  loginDto: UserLoginDTO
): Promise<UserOutput | null> => {
  const { email, username, password } = loginDto;

  const whereClause: any = {
    [Op.or]: [],
  };
  if (email) whereClause[Op.or].push({ email });
  if (username) whereClause[Op.or].push({ username });

  const user = await User.findOne({
    where: whereClause,
  });

  if (!user) return null; // Utente non trovato

  const u: UserOutput = {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    userRole: user.userRole,
  };

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return null; // Password non valida
  }

  const payload: IUserJwtPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.userRole,
  };
  const token = generateToken(payload);
  u.token = token;

  return u;
};
