import { Category } from '../models/Category.model';
import { ApiError } from '../types/error';
import { ErrorCodeEnum } from '../constants/error-code';
import cloudinary from '../config/cloudinary.config';

export const createCategory = async ({
  name,
  thumbnailUrl,
  thumbnailPublicId,
  createdBy,
}: {
  name: string;
  thumbnailUrl: string;
  thumbnailPublicId: string;
  createdBy: string;
}) => {
  const exists = await Category.findOne({ name });
  if (exists) throw new ApiError(409, ErrorCodeEnum.DUPLICATE_RESOURCE);

  const category = await Category.create({
    name,
    thumbnailUrl,
    thumbnailPublicId,
    createdBy,
  });

  return category;
};

export const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

export const deleteCategory = async (id: string) => {
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }
  
    // Delete image from Cloudinary
    if (category.thumbnailPublicId) {
      try {
        await cloudinary.uploader.destroy(category.thumbnailPublicId);
      } catch (err) {
        console.warn("⚠️ Cloudinary image deletion failed:", err);
      }
    }
  
    await category.deleteOne();
    return category;
  };
