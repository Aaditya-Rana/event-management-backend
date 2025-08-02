import { Request, Response } from 'express';
import * as EventService from '../services/event.service';
import { sendError } from '../utils/errorHandler';
import { ApiError } from '../types/error';
import { AuthRequest } from '../middleware/auth.middleware';
import { Types } from 'mongoose';

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      date,
      isOnline,
      capacity,
      category,
    } = req.body;

    if (!req.file?.path || !req.user?.id) {
      return sendError(res, 400, 'VALIDATION_ERROR');
    }

    const event = await EventService.createEvent({
      title,
      description,
      location,
      date,
      isOnline,
      capacity,
      category,
      createdBy: new Types.ObjectId(req.user.id),
      thumbnailUrl: req.file.path,
      thumbnailPublicId: req.file.filename,
    });

    return res.status(201).json({ success: true, data: event });
  } catch (err) {
    if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, isOnline, search, status, startDate, endDate } = req.query;

    const result = await EventService.getAllEvents(
      parseInt(page as string),
      parseInt(limit as string),
      {
        category: category as string,
        isOnline: isOnline === 'true' ? true : isOnline === 'false' ? false : undefined,
        search: search as string,
        status: status as 'UPCOMING' | 'ONGOING' | 'COMPLETED',
        startDate: startDate as string,
        endDate: endDate as string,
      }
    );

    return res.status(200).json({ success: true, ...result });
  } catch {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await EventService.getEventById(req.params.id);
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const {
      title,
      description,
      location,
      date,
      isOnline,
      category,
      capacity,
    } = req.body;

    const updatedEvent = await EventService.updateEvent(
      id,
      {
        title,
        description,
        location,
        date,
        isOnline,
        category,
        capacity,
      },
      userId!,
      req.file?.path,
      req.file?.filename
    );

    return res.status(200).json({ success: true, data: updatedEvent });
  } catch (err) {
    if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await EventService.deleteEvent(req.params.id, req.user!.id);
    return res.status(200).json({ success: true, data: event });
  } catch (err) {
    if (err instanceof ApiError) return sendError(res, err.statusCode, err.code);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR');
  }
};
