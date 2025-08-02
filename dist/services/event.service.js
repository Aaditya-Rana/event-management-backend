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
exports.deleteEvent = exports.updateEvent = exports.getAllEvents = exports.getEventById = exports.createEvent = void 0;
const Event_model_1 = require("../models/Event.model");
const error_1 = require("../types/error");
const error_code_1 = require("../constants/error-code");
const cloudinary_1 = require("cloudinary");
const generateEventId_1 = require("../utils/generateEventId");
const createEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = (0, generateEventId_1.generateEventId)(payload.date);
    const event = yield Event_model_1.Event.create(Object.assign(Object.assign({}, payload), { eventId }));
    return event.toObject({ virtuals: true }); // Ensures virtuals included
});
exports.createEvent = createEvent;
const getEventById = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Event_model_1.Event.findOne({ eventId })
        .populate('category')
        .populate('createdBy');
    if (!doc)
        throw new error_1.ApiError(404, error_code_1.ErrorCodeEnum.RESOURCE_NOT_FOUND);
    return doc.toObject({ virtuals: true });
});
exports.getEventById = getEventById;
const getAllEvents = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10, filters) {
    const query = {};
    if (filters.category)
        query.category = filters.category;
    if (typeof filters.isOnline === 'boolean')
        query.isOnline = filters.isOnline;
    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
        ];
    }
    if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate)
            query.date.$gte = new Date(filters.startDate);
        if (filters.endDate)
            query.date.$lte = new Date(filters.endDate);
    }
    const docs = yield Event_model_1.Event.find(query)
        .populate('category')
        .populate('createdBy')
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
    const allEvents = docs.map((doc) => doc.toObject({ virtuals: true }));
    const total = yield Event_model_1.Event.countDocuments(query);
    return {
        data: allEvents,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
});
exports.getAllEvents = getAllEvents;
const updateEvent = (eventId, payload, userId, newThumbnailPath, newThumbnailPublicId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event_model_1.Event.findOne({ eventId });
    if (!event)
        throw new error_1.ApiError(404, error_code_1.ErrorCodeEnum.RESOURCE_NOT_FOUND);
    if (event.createdBy.toString() !== userId) {
        throw new error_1.ApiError(403, error_code_1.ErrorCodeEnum.ACCESS_FORBIDDEN);
    }
    if (newThumbnailPath && newThumbnailPublicId) {
        if (event.thumbnailPublicId) {
            yield cloudinary_1.v2.uploader.destroy(event.thumbnailPublicId);
        }
        event.thumbnailUrl = newThumbnailPath;
        event.thumbnailPublicId = newThumbnailPublicId;
    }
    if (payload.date && payload.date.toString() !== event.date.toString()) {
        event.eventId = (0, generateEventId_1.generateEventId)(payload.date);
    }
    Object.assign(event, payload);
    yield event.save();
    return event.toObject({ virtuals: true });
});
exports.updateEvent = updateEvent;
const deleteEvent = (eventId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield Event_model_1.Event.findOne({ eventId });
    if (!event)
        throw new error_1.ApiError(404, error_code_1.ErrorCodeEnum.RESOURCE_NOT_FOUND);
    if (event.createdBy.toString() !== userId) {
        throw new error_1.ApiError(403, error_code_1.ErrorCodeEnum.ACCESS_FORBIDDEN);
    }
    if (event.thumbnailPublicId) {
        yield cloudinary_1.v2.uploader.destroy(event.thumbnailPublicId);
    }
    yield event.deleteOne();
    return event.toObject({ virtuals: true });
});
exports.deleteEvent = deleteEvent;
