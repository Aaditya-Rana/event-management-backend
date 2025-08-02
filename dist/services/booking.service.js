"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsByEventId = exports.getAllBookings = exports.cancelBooking = exports.getUserBookings = exports.createBooking = void 0;
const Booking_model_1 = require("../models/Booking.model");
const Event_model_1 = require("../models/Event.model");
const error_1 = require("../types/error");
const error_code_1 = require("../constants/error-code");
const enums_1 = require("../constants/enums");
const mongoose_1 = require("mongoose");
const createBooking = (userId, eventId, seats) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const event = yield Event_model_1.Event.findById(eventId);
    if (!event)
        throw new error_1.ApiError(404, error_code_1.ErrorCodeEnum.RESOURCE_NOT_FOUND);
    // Check if event already completed
    const now = new Date();
    if (new Date(event.date) < now) {
        throw new error_1.ApiError(400, error_code_1.ErrorCodeEnum.VALIDATION_ERROR);
    }
    // Check event capacity
    const totalBooked = yield Booking_model_1.Booking.aggregate([
        { $match: { event: new mongoose_1.Types.ObjectId(eventId) } },
        { $group: { _id: null, total: { $sum: "$seats" } } },
    ]);
    const bookedSeats = ((_a = totalBooked[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const remainingSeats = event.capacity - bookedSeats;
    if (seats > remainingSeats) {
        throw new error_1.ApiError(400, error_code_1.ErrorCodeEnum.VALIDATION_ERROR);
    }
    // Prevent multiple bookings for same event by same user
    const existing = yield Booking_model_1.Booking.findOne({ user: userId, event: eventId });
    if (existing) {
        throw new error_1.ApiError(400, error_code_1.ErrorCodeEnum.ALREADY_BOOKED);
    }
    const booking = yield Booking_model_1.Booking.create({
        user: new mongoose_1.Types.ObjectId(userId),
        event: new mongoose_1.Types.ObjectId(eventId),
        seats,
        status: enums_1.BookingStatus.CONFIRMED,
    });
    return booking;
});
exports.createBooking = createBooking;
const getUserBookings = (userId_1, ...args_1) => __awaiter(void 0, [userId_1, ...args_1], void 0, function* (userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [bookings, total] = yield Promise.all([
        Booking_model_1.Booking.find({ user: new mongoose_1.Types.ObjectId(userId) })
            .populate('event')
            .sort({ bookedAt: -1 })
            .skip(skip)
            .limit(limit),
        Booking_model_1.Booking.countDocuments({ user: new mongoose_1.Types.ObjectId(userId) }),
    ]);
    return {
        bookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
});
exports.getUserBookings = getUserBookings;
const cancelBooking = (bookingId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield Booking_model_1.Booking.findById(bookingId).populate('event');
    if (!booking)
        throw new error_1.ApiError(404, error_code_1.ErrorCodeEnum.RESOURCE_NOT_FOUND);
    if (booking.user.toString() !== userId) {
        throw new error_1.ApiError(403, error_code_1.ErrorCodeEnum.ACCESS_FORBIDDEN);
    }
    if (booking.event.date <= new Date()) {
        throw new error_1.ApiError(400, error_code_1.ErrorCodeEnum.VALIDATION_ERROR); // Event already started
    }
    booking.status = enums_1.BookingStatus.CANCELLED;
    yield booking.save();
    return booking;
});
exports.cancelBooking = cancelBooking;
const getAllBookings = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [bookings, total] = yield Promise.all([
        Booking_model_1.Booking.find()
            .populate('user', 'name email')
            .populate('event', 'title date')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }),
        Booking_model_1.Booking.countDocuments(),
    ]);
    return {
        bookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
});
exports.getAllBookings = getAllBookings;
const getBookingsByEventId = (eventId, page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = (page - 1) * limit;
    const [bookings, total] = yield Promise.all([
        Booking_model_1.Booking.find({ event: new mongoose_1.Types.ObjectId(eventId) })
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Booking_model_1.Booking.countDocuments({ event: new mongoose_1.Types.ObjectId(eventId) }),
    ]);
    return {
        bookings,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
});
exports.getBookingsByEventId = getBookingsByEventId;
