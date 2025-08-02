import * as BookingService from '../services/booking.service';
import { Request, Response } from 'express';
import { sendError } from '../utils/errorHandler';
import { ApiError } from '../types/error';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await BookingService.getAllBookings(page, limit);
    return res.status(200).json({ success: true, ...result });
  } catch {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const getBookingsByEvent = async (req: Request, res: Response) => {
  try {
    const { id: eventId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await BookingService.getBookingsByEventId(eventId, page, limit);
    return res.status(200).json({ success: true, ...result });
  } catch {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};


export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
      const { eventId, seats } = req.body;
      const userId = req.user?.id;
  
      const booking = await BookingService.createBooking(userId!, eventId, parseInt(seats));
      return res.status(201).json({ success: true, ...booking });
    } catch (err) {
      if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
    }
  };
  
  export const getUserBookings = async (req: AuthRequest, res: Response) => {
    try {
      const bookings = await BookingService.getUserBookings(req.user!.id);
      return res.status(200).json({ success: true, ...bookings });
    } catch {
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
    }
  };
  
  export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
      const booking = await BookingService.cancelBooking(req.params.id, req.user!.id);
      return res.status(200).json({ success: true, ...booking });
    } catch (err) {
      if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
      return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
    }
  };