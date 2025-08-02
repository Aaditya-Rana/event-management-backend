"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingLog = void 0;
const mongoose_1 = require("mongoose");
const enums_1 = require("../constants/enums");
const bookingLogSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Event', required: true },
    action: {
        type: String,
        enum: Object.values(enums_1.BookingAction),
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
exports.BookingLog = (0, mongoose_1.model)('BookingLog', bookingLogSchema);
