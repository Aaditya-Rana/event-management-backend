import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';
import { sendError } from '../utils/errorHandler';
import { ApiError } from '../types/error';
import { AuthRequest } from '../middleware/auth.middleware';

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const createdBy = req.user?.id;

    if (!name || !req.file?.path || !createdBy) {
      return sendError(res, 400, 'VALIDATION_ERROR');
    }

    const thumbnailUrl = req.file.path; // secure_url from multer-storage-cloudinary
    const thumbnailPublicId = req.file.filename; // public_id from Cloudinary

    const category = await categoryService.createCategory({
      name,
      thumbnailUrl,
      thumbnailPublicId,
      createdBy,
    });

    return res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({ success: true, data: categories });
  } catch {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await categoryService.deleteCategory(id);
    return res.status(200).json({ success: true, data: deleted });
  } catch (err) {
    if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};
