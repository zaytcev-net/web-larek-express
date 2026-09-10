import "dotenv/config";
import type { StringValue } from "ms";

const config = {
  port: process.env.PORT || "3000",

  dbAddress: process.env.DB_ADDRESS || "mongodb://127.0.0.1:27017/weblarek",

  uploadPath: process.env.UPLOAD_PATH || "images",

  uploadPathTemp: process.env.UPLOAD_PATH_TEMP || "temp",

  originAllow: process.env.ORIGIN_ALLOW || "http://localhost:5173",

  authRefreshTokenExpiry: (process.env.AUTH_REFRESH_TOKEN_EXPIRY ||
    "7d") as StringValue,

  authAccessTokenExpiry: (process.env.AUTH_ACCESS_TOKEN_EXPIRY ||
    "10m") as StringValue,

  jwtSecret: process.env.JWT_SECRET || "development-secret",
};

export default config;
