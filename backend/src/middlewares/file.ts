import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import config from '../config';
import BaseError from '../errors/base-error';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../public', config.uploadPathTemp));
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);

    const fileName = `${crypto.randomUUID()}${extension}`;

    cb(null, fileName);
  },
});

const fileMiddleware = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(new BaseError('Можно загружать только изображения', 400));
    }
  },
});

export default fileMiddleware;
