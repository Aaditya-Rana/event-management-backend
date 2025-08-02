"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const get_env_1 = require("../utils/get-env");
const appConfig = () => ({
    NODE_ENV: (0, get_env_1.getEnv)("NODE_ENV", "development"),
    PORT: (0, get_env_1.getEnv)("PORT", "5000"),
    BASE_PATH: (0, get_env_1.getEnv)("BASE_PATH", "/api"),
    MONGO_URI: (0, get_env_1.getEnv)("MONGO_URI", ""),
    JWT_SECRET: (0, get_env_1.getEnv)("JWT_SECRET"),
    CLOUDINARY_CLOUD_NAME: (0, get_env_1.getEnv)("CLOUDINARY_CLOUD_NAME"),
    CLOUDINARY_API_KEY: (0, get_env_1.getEnv)("CLOUDINARY_API_KEY"),
    CLOUDINARY_API_SECRET: (0, get_env_1.getEnv)("CLOUDINARY_API_SECRET"),
    FRONTEND_ORIGIN: (0, get_env_1.getEnv)("FRONTEND_ORIGIN", "localhost"),
});
exports.config = appConfig();
