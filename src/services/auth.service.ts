import { User, IUser } from '../models/User.model';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../types/error';
import { ErrorCodeEnum } from '../constants/error-code';

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<IUser> => {
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS);

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string }> => {
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, ErrorCodeEnum.AUTH_EMAIL_NOT_EXISTS);

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new ApiError(401, ErrorCodeEnum.INCORRECT_PASSWORD);

  const token = generateToken(user._id.toString(), user.role);
  return { token };
};
