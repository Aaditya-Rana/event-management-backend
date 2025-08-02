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
exports.logout = exports.login = exports.register = exports.getCurrentUser = void 0;
const AuthService = __importStar(require("../services/auth.service"));
const errorHandler_1 = require("../utils/errorHandler");
const error_1 = require("../types/error");
const User_model_1 = require("../models/User.model");
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield User_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select("-password");
        if (!user) {
            return (0, errorHandler_1.sendError)(res, 404, "AUTH_USER_NOT_FOUND");
        }
        return res.status(200).json({ success: true, data: user });
    }
    catch (err) {
        return (0, errorHandler_1.sendError)(res, 500, "INTERNAL_SERVER_ERROR");
    }
});
exports.getCurrentUser = getCurrentUser;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const user = yield AuthService.registerUser(name, email, password);
        return res.status(201).json({ success: true, data: user });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { token } = yield AuthService.loginUser(email, password);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({ success: true, message: 'Login successful' });
    }
    catch (err) {
        if (err instanceof error_1.ApiError)
            return (0, errorHandler_1.sendError)(res, err.statusCode, err.code);
        return (0, errorHandler_1.sendError)(res, 500, 'INTERNAL_SERVER_ERROR');
    }
});
exports.login = login;
const logout = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken');
    return res.status(200).json({ success: true, message: 'Logout successful' });
});
exports.logout = logout;
