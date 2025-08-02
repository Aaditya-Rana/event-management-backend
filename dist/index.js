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
require('dotenv').config();
require("./config/cloudinary.config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_config_1 = require("./config/app.config");
const db_config_1 = __importDefault(require("./config/db.config"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const BASE_PATH = app_config_1.config.BASE_PATH;
const app = (0, express_1.default)();
const allowedOrigins = app_config_1.config.FRONTEND_ORIGIN.split(",") || [];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/', (_req, res) => {
    res.send('✅ EventEase API running');
});
app.use(`${BASE_PATH}/auth`, auth_routes_1.default);
app.use(`${BASE_PATH}/categories`, category_routes_1.default);
app.use(`${BASE_PATH}/events`, event_routes_1.default);
app.use(`${BASE_PATH}/bookings`, booking_routes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});
const PORT = app_config_1.config.PORT || 5000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    yield (0, db_config_1.default)();
}));
