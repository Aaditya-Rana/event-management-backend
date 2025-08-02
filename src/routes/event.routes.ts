import express from 'express';
import * as EventController from '../controllers/event.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', EventController.getAllEvents);
router.get('/:id', EventController.getEvent);

router.post('/', authenticate, authorizeAdmin, upload.single('image'), EventController.createEvent);
router.put('/:id', authenticate, authorizeAdmin, upload.single('image'), EventController.updateEvent);
router.delete('/:id', authenticate, authorizeAdmin, EventController.deleteEvent);

export default router;
