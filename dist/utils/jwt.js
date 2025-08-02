"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_config_1 = require("../config/app.config");
const TOKEN_EXPIRY = '7d';
const JWT_ALGORITHM = 'HS256';
const generateToken = (userId, role = 'user') => jsonwebtoken_1.default.sign({ id: userId, role }, app_config_1.config.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
    algorithm: JWT_ALGORITHM,
});
exports.generateToken = generateToken;
const verifyToken = (token, secret = app_config_1.config.JWT_SECRET) => jsonwebtoken_1.default.verify(token, secret, { algorithms: [JWT_ALGORITHM] });
exports.verifyToken = verifyToken;
