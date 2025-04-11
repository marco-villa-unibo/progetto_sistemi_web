import jwt from 'jsonwebtoken';
import { IUserJwtPayload } from '../api/interfaces';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Assicurati di avere una chiave segreta forte nell'.env

export const generateToken = (payload: IUserJwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Scade dopo 1 ora (personalizza la durata)
};

export const verifyToken = (token: string): IUserJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IUserJwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
