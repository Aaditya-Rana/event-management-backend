"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const error_code_1 = require("../constants/error-code");
class ApiError extends Error {
    constructor(statusCode, code) {
        super(error_code_1.ErrorCodeEnum[code]);
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.ApiError = ApiError;
