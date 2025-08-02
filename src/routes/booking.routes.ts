import express from 'express';
import * as BookingController from '../controllers/booking.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticate, BookingController.createBooking);
router.get('/me', authenticate, BookingController.getUserBookings);
router.patch('/:id/cancel', authenticate, BookingController.cancelBooking);

router.get('/admin', authenticate, authorizeAdmin, BookingController.getAllBookings);
router.get('/admin/event/:id', authenticate, authorizeAdmin, BookingController.getBookingsByEvent);

export default router;
