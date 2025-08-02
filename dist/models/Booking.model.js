"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../constants/enums");
const bookingSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Event', required: true },
    seats: { type: Number, required: true, min: 1, max: 2 },
    status: {
        type: String,
        enum: Object.values(enums_1.BookingStatus),
        default: enums_1.BookingStatus.CONFIRMED,
    },
    bookedAt: { type: Date, default: Date.now },
}, { timestamps: true });
bookingSchema.index({ user: 1, event: 1 }, { unique: true });
exports.Booking = (0, mongoose_1.model)('Booking', bookingSchema);
