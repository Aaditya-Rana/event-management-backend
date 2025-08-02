"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEventId = generateEventId;
const dayjs_1 = __importDefault(require("dayjs"));
function generateEventId(date) {
    const month = (0, dayjs_1.default)(date).format('MMM').toUpperCase();
    const year = (0, dayjs_1.default)(date).format('YYYY');
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `EVT-${month}${year}-${random}`;
}
