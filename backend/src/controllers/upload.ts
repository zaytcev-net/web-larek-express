import { Request, Response, NextFunction } from "express";
import path from "path";

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Файл не передан",
      });
    }

    return res.status(200).json({
      fileName: `/images/${path.basename(req.file.filename)}`,
      originalName: req.file.originalname,
    });
  } catch (error) {
    return next(error);
  }
};
