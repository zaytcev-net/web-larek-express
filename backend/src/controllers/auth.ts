import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/base-error";
import config from "../config";
import bcrypt from "bcryptjs";
import ms from "ms";
import { CookieOptions } from "express";

import User from "../models/user";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/token";

interface RegisterBody {
  name?: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: ms(config.authRefreshTokenExpiry || "7d"),
  path: "/",
};

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tokens: [],
    });

    const accessToken = createAccessToken(user._id.toString());

    const refreshToken = createRefreshToken(user._id.toString());

    user.tokens.push({
      token: refreshToken,
    });

    await user.save();

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(201).json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +tokens");

    if (!user) {
      return next(new BaseError("Неверный email или пароль", 401));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(new BaseError("Неверный email или пароль", 401));
    }

    const accessToken = createAccessToken(user._id.toString());

    const refreshToken = createRefreshToken(user._id.toString());

    user.tokens.push({
      token: refreshToken,
    });

    await user.save();

    res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(error);
  }
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new BaseError("Необходима авторизация", 401));
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await User.findById(payload._id).select("+tokens");

    if (!user) {
      return next(new BaseError("Пользователь не найден", 401));
    }

    const tokenExists = user.tokens.some((item) => item.token === refreshToken);

    if (!tokenExists) {
      return next(new BaseError("Недействительный refresh token", 401));
    }

    const accessToken = createAccessToken(user._id.toString());

    const newRefreshToken = createRefreshToken(user._id.toString());

    user.tokens = user.tokens.filter((item) => item.token !== refreshToken);

    user.tokens.push({
      token: newRefreshToken,
    });

    await user.save();

    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(new BaseError("Недействительный refresh token", 401));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new BaseError("Необходима авторизация", 401));
    }

    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      return next(new BaseError("Недействительный refresh token", 401));
    }

    if (!mongoose.Types.ObjectId.isValid(payload._id)) {
      return next(new BaseError("Некорректный ID пользователя", 400));
    }

    const user = await User.findById(payload._id).select("+tokens");

    if (!user) {
      return next(new BaseError("Пользователь не найден", 404));
    }

    user.tokens = user.tokens.filter((item) => item.token !== refreshToken);

    await user.save();

    res.cookie("refreshToken", "", {
      ...refreshTokenCookieOptions,
      maxAge: 0,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return next(new BaseError("Пользователь не найден", 404));
    }

    return res.status(200).json({
      user: {
        email: user.email,
        name: user.name,
      },
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
