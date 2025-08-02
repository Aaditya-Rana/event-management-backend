import jwt from 'jsonwebtoken';
import { config } from '../config/app.config';

const TOKEN_EXPIRY = '7d';
const JWT_ALGORITHM: jwt.Algorithm = 'HS256';

export const generateToken = (userId: string, role: string = 'user') =>
  jwt.sign(
    { id:userId, role },
    config.JWT_SECRET!,
    {
      expiresIn: TOKEN_EXPIRY,
      algorithm: JWT_ALGORITHM,
    }
  );

export const verifyToken = (token: string, secret = config.JWT_SECRET!) =>
  jwt.verify(token, secret, { algorithms: [JWT_ALGORITHM] });

