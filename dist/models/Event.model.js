"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const mongoose_1 = require("mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const enums_1 = require("../constants/enums");
const eventSchema = new mongoose_1.Schema({
    eventId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    location: String,
    isOnline: { type: Boolean, default: false },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    date: { type: Date, required: true },
    capacity: { type: Number, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    thumbnailUrl: { type: String, required: true },
    thumbnailPublicId: String,
}, { timestamps: true });
eventSchema.virtual('status').get(function () {
    const today = (0, dayjs_1.default)().startOf('day');
    const eventDate = (0, dayjs_1.default)(this.date).startOf('day');
    if (eventDate.isBefore(today))
        return enums_1.EventStatus.COMPLETED;
    if (eventDate.isSame(today))
        return enums_1.EventStatus.ONGOING;
    return enums_1.EventStatus.UPCOMING;
});
eventSchema.set("toObject", { virtuals: true });
eventSchema.set("toJSON", { virtuals: true });
exports.Event = (0, mongoose_1.model)('Event', eventSchema);
