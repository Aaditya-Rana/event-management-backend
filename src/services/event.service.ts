import { Event } from '../models/Event.model';
import { ApiError } from '../types/error';
import { ErrorCodeEnum } from '../constants/error-code';
import { IEvent } from '../models/Event.model';
import { FilterQuery } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { generateEventId } from '../utils/generateEventId';

export const createEvent = async (payload: Partial<IEvent>) => {
  const eventId = generateEventId(payload.date!);
  const event = await Event.create({ ...payload, eventId });
  return event.toObject({ virtuals: true }); // Ensures virtuals included
};

export const getEventById = async (eventId: string) => {
  const doc = await Event.findOne({ eventId })
    .populate('category')
    .populate('createdBy');

  if (!doc) throw new ApiError(404, ErrorCodeEnum.RESOURCE_NOT_FOUND);
  return doc.toObject({ virtuals: true });
};

export const getAllEvents = async (
  page: number = 1,
  limit: number = 10,
  filters: {
    category?: string;
    isOnline?: boolean;
    search?: string;
    status?: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
    startDate?: string;
    endDate?: string;
  }
) => {
  const query: FilterQuery<IEvent> = {};

  if (filters.category) query.category = filters.category;
  if (typeof filters.isOnline === 'boolean') query.isOnline = filters.isOnline;

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
    ];
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  const docs = await Event.find(query)
    .populate('category')
    .populate('createdBy')
    .sort({ date: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const allEvents = docs.map((doc) => doc.toObject({ virtuals: true }));

  const total = await Event.countDocuments(query);

  return {
    data: allEvents,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateEvent = async (
  eventId: string,
  payload: Partial<IEvent>,
  userId: string,
  newThumbnailPath?: string,
  newThumbnailPublicId?: string
) => {
  const event = await Event.findOne({ eventId });
  if (!event) throw new ApiError(404, ErrorCodeEnum.RESOURCE_NOT_FOUND);

  if (event.createdBy.toString() !== userId) {
    throw new ApiError(403, ErrorCodeEnum.ACCESS_FORBIDDEN);
  }

  if (newThumbnailPath && newThumbnailPublicId) {
    if (event.thumbnailPublicId) {
      await cloudinary.uploader.destroy(event.thumbnailPublicId);
    }
    event.thumbnailUrl = newThumbnailPath;
    event.thumbnailPublicId = newThumbnailPublicId;
  }

  if (payload.date && payload.date.toString() !== event.date.toString()) {
    event.eventId = generateEventId(payload.date);
  }

  Object.assign(event, payload);
  await event.save();

  return event.toObject({ virtuals: true });
};

export const deleteEvent = async (eventId: string, userId: string) => {
  const event = await Event.findOne({ eventId });
  if (!event) throw new ApiError(404, ErrorCodeEnum.RESOURCE_NOT_FOUND);

  if (event.createdBy.toString() !== userId) {
    throw new ApiError(403, ErrorCodeEnum.ACCESS_FORBIDDEN);
  }

  if (event.thumbnailPublicId) {
    await cloudinary.uploader.destroy(event.thumbnailPublicId);
  }

  await event.deleteOne();
  return event.toObject({ virtuals: true });
};
