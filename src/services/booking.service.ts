import { Booking } from '../models/Booking.model';
import { Event } from '../models/Event.model';
import { ApiError } from '../types/error';
import { ErrorCodeEnum } from '../constants/error-code';
import { BookingStatus } from '../constants/enums';
import { Types } from 'mongoose';

export const createBooking = async (
  userId: string,
  eventId: string,
  seats: number
) => {
  const event = await Event.findById(eventId);
  if (!event) throw new ApiError(404, ErrorCodeEnum.RESOURCE_NOT_FOUND);

  // Check if event already completed
  const now = new Date();
  if (new Date(event.date) < now) {
    throw new ApiError(400, ErrorCodeEnum.VALIDATION_ERROR);
  }

  // Check event capacity
  const totalBooked = await Booking.aggregate([
    { $match: { event: new Types.ObjectId(eventId) } },
    { $group: { _id: null, total: { $sum: "$seats" } } },
  ]);

  const bookedSeats = totalBooked[0]?.total || 0;
  const remainingSeats = event.capacity - bookedSeats;
  if (seats > remainingSeats) {
    throw new ApiError(400, ErrorCodeEnum.VALIDATION_ERROR);
  }

  // Prevent multiple bookings for same event by same user
  const existing = await Booking.findOne({ user: userId, event: eventId });
  if (existing) {
    throw new ApiError(400, ErrorCodeEnum.ALREADY_BOOKED);
  }

  const booking = await Booking.create({
    user: new Types.ObjectId(userId),
    event: new Types.ObjectId(eventId),
    seats,
    status: BookingStatus.CONFIRMED,
  });

  return booking;
};

export const getUserBookings = async (
  userId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [bookings, total] = await Promise.all([
    Booking.find({ user: new Types.ObjectId(userId) })
      .populate('event')
      .sort({ bookedAt: -1 })
      .skip(skip)
      .limit(limit),
    Booking.countDocuments({ user: new Types.ObjectId(userId) }),
  ]);

  return {
    bookings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};


export const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await Booking.findById(bookingId).populate('event');
  if (!booking) throw new ApiError(404, ErrorCodeEnum.RESOURCE_NOT_FOUND);

  if (booking.user.toString() !== userId) {
    throw new ApiError(403, ErrorCodeEnum.ACCESS_FORBIDDEN);
  }

  if ((booking.event as any).date <= new Date()) {
    throw new ApiError(400, ErrorCodeEnum.VALIDATION_ERROR); // Event already started
  }

  booking.status = BookingStatus.CANCELLED;
  await booking.save();
  return booking;
};


export const getAllBookings = async (
    page: number,
    limit: number
  ) => {
    const skip = (page - 1) * limit;
  
    const [bookings, total] = await Promise.all([
      Booking.find()
        .populate('user', 'name email')
        .populate('event', 'title date')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Booking.countDocuments(),
    ]);
  
    return {
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  };

  
  export const getBookingsByEventId = async (
    eventId: string,
    page: number,
    limit: number
  ) => {
    const skip = (page - 1) * limit;
  
    const [bookings, total] = await Promise.all([
      Booking.find({ event: new Types.ObjectId(eventId) })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments({ event: new Types.ObjectId(eventId) }),
    ]);
  
    return {
      bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
};
