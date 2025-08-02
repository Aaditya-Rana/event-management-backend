"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteEvent = exports.updateEvent = exports.getEvent = exports.getAllEvents = exports.createEvent = void 0;
const EventService = __importStar(require("../services/event.service"));
const errorHandler_1 = require("../utils/errorHandler");
const error_1 = require("../types/error");
const mongoose_1 = require("mongoose");
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, description, location, date, isOnline, capacity, category, } = req.body;
        if (!((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) || !((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            return (0, errorHandler_1.sendError)(res, 400, 'VALIDATION_ERROR');
        }
        const event = yield EventService.createEvent({
            title,
            description,
            location,
            date,
            isOnline,
            capacity,
            category,
            createdBy: new mongoose_1.Types.ObjectId(req.user.id),
            thumbnailUrl: req.file.path,
            thumbnailPublicId: req.file.filename,
        });
        return res.status(201).json({ success: true, data: event });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.createEvent = createEvent;
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, category, isOnline, search, status, startDate, endDate } = req.query;
        const result = yield EventService.getAllEvents(parseInt(page), parseInt(limit), {
            category: category,
            isOnline: isOnline === 'true' ? true : isOnline === 'false' ? false : undefined,
            search: search,
            status: status,
            startDate: startDate,
            endDate: endDate,
        });
        return res.status(200).json(Object.assign({ success: true }, result));
    }
    catch (_a) {
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.getAllEvents = getAllEvents;
const getEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield EventService.getEventById(req.params.id);
        return res.status(200).json({ success: true, data: event });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.getEvent = getEvent;
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { title, description, location, date, isOnline, category, capacity, } = req.body;
        const updatedEvent = yield EventService.updateEvent(id, {
            title,
            description,
            location,
            date,
            isOnline,
            category,
            capacity,
        }, userId, (_b = req.file) === null || _b === void 0 ? void 0 : _b.path, (_c = req.file) === null || _c === void 0 ? void 0 : _c.filename);
        return res.status(200).json({ success: true, data: updatedEvent });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.updateEvent = updateEvent;
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield EventService.deleteEvent(req.params.id, req.user.id);
        return res.status(200).json({ success: true, data: event });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.deleteEvent = deleteEvent;
