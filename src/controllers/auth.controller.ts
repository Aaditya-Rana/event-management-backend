import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';
import { sendError } from '../utils/errorHandler';
import { ApiError } from '../types/error';
import { User } from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");

    if (!user) {
      return sendError(res, 404, "AUTH_USER_NOT_FOUND");
    }

    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    return sendError(res, 500, "INTERNAL_SERVER_ERROR");
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.registerUser(name, email, password);
    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { token } = await AuthService.loginUser(email, password);
  
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      return res.status(200).json({ success: true, message: 'Login successful' });
    } catch (err) {
      if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
    }
  };

  export const logout = async (_req: Request, res: Response) => {
    res.clearCookie('accessToken');
    return res.status(200).json({ success: true, message: 'Logout successful' });
  };
  