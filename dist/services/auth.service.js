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
exports.loginUser = exports.registerUser = void 0;
const User_model_1 = require("../models/User.model");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const error_1 = require("../types/error");
const error_code_1 = require("../constants/error-code");
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield User_model_1.User.findOne({ email });
    if (existing)
        throw new error_1.ApiError(409, error_code_1.ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS);
    const hashedPassword = yield (0, password_1.hashPassword)(password);
    const user = yield User_model_1.User.create({
        name,
        email,
        password: hashedPassword,
        role: 'user',
    });
    return user;
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_model_1.User.findOne({ email });
    if (!user)
        throw new error_1.ApiError(404, error_code_1.ErrorCodeEnum.AUTH_EMAIL_NOT_EXISTS);
    const isMatch = yield (0, password_1.comparePassword)(password, user.password);
    if (!isMatch)
        throw new error_1.ApiError(401, error_code_1.ErrorCodeEnum.INCORRECT_PASSWORD);
    const token = (0, jwt_1.generateToken)(user._id.toString(), user.role);
    return { token };
});
exports.loginUser = loginUser;
