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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.getAllCategories = exports.createCategory = void 0;
const Category_model_1 = require("../models/Category.model");
const error_1 = require("../types/error");
const error_code_1 = require("../constants/error-code");
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const createCategory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, thumbnailUrl, thumbnailPublicId, createdBy, }) {
    const exists = yield Category_model_1.Category.findOne({ name });
    if (exists)
        throw new error_1.ApiError(409, error_code_1.ErrorCodeEnum.DUPLICATE_RESOURCE);
    const category = yield Category_model_1.Category.create({
        name,
        thumbnailUrl,
        thumbnailPublicId,
        createdBy,
    });
    return category;
});
exports.createCategory = createCategory;
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Category_model_1.Category.find().sort({ createdAt: -1 });
});
exports.getAllCategories = getAllCategories;
const deleteCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category_model_1.Category.findById(id);
    if (!category) {
        throw new error_1.ApiError(404, error_code_1.ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }
    // Delete image from Cloudinary
    if (category.thumbnailPublicId) {
        try {
            yield cloudinary_config_1.default.uploader.destroy(category.thumbnailPublicId);
        }
        catch (err) {
            console.warn("⚠️ Cloudinary image deletion failed:", err);
        }
    }
    yield category.deleteOne();
    return category;
});
exports.deleteCategory = deleteCategory;
