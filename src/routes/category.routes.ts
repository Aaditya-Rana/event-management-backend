import express from 'express';
import * as categoryController from '../controllers/category.controller';
import { authenticate, authorizeAdmin} from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

router.post(
  '/',
  authenticate,
  authorizeAdmin,
  upload.single('image'),
  categoryController.createCategory
);

router.get('/', categoryController.getCategories);

router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  categoryController.deleteCategory
);

export default router;
