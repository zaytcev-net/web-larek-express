import jwt from "jsonwebtoken";

import config from "../config";

interface TokenPayload {
  _id: string;
}

export const createAccessToken = (userId: string): string => {
  return jwt.sign({ _id: userId }, config.jwtSecret, {
    expiresIn: config.authAccessTokenExpiry,
  });
};

export const createRefreshToken = (userId: string): string => {
  return jwt.sign({ _id: userId }, config.jwtSecret, {
    expiresIn: config.authRefreshTokenExpiry,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};
