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
exports.deleteCategory = exports.getCategories = exports.createCategory = void 0;
const categoryService = __importStar(require("../services/category.service"));
const errorHandler_1 = require("../utils/errorHandler");
const error_1 = require("../types/error");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name } = req.body;
        const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!name || !((_b = req.file) === null || _b === void 0 ? void 0 : _b.path) || !createdBy) {
            return (0, errorHandler_1.sendError)(res, 400, 'VALIDATION_ERROR');
        }
        const thumbnailUrl = req.file.path; // secure_url from multer-storage-cloudinary
        const thumbnailPublicId = req.file.filename; // public_id from Cloudinary
        const category = yield categoryService.createCategory({
            name,
            thumbnailUrl,
            thumbnailPublicId,
            createdBy,
        });
        return res.status(201).json({ success: true, data: category });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.createCategory = createCategory;
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield categoryService.getAllCategories();
        return res.status(200).json({ success: true, data: categories });
    }
    catch (_a) {
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.getCategories = getCategories;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const deleted = yield categoryService.deleteCategory(id);
        return res.status(200).json({ success: true, data: deleted });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.deleteCategory = deleteCategory;
