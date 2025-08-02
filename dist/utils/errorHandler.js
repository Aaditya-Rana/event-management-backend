"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = void 0;
const error_code_1 = require("../constants/error-code");
const sendError = (res, statusCode, code) => {
    return res.status(statusCode).json({
        success: false,
        errorCode: code,
        message: error_code_1.ErrorMessageMap[code],
    });
};
exports.sendError = sendError;
