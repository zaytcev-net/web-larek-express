import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';

import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

interface OrderBody {
  payment: 'card' | 'online';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

const createOrder = async (
  req: Request<{}, {}, OrderBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;

    const invalidItemId = items.find(
      (itemId) => !mongoose.Types.ObjectId.isValid(itemId),
    );

    if (invalidItemId) {
      return next(new BadRequestError('Передан не валидный ID товара'));
    }

    const products = await Product.find({
      _id: { $in: items },
    });

    const missingProductId = items.find(
      (itemId) => !products.some((product) => product._id.toString() === itemId),
    );

    if (missingProductId) {
      return next(
        new BadRequestError(`Товар с id ${missingProductId} не найден`),
      );
    }

    const unavailableProductId = items.find((itemId) => {
      const product = products.find((item) => item._id.toString() === itemId);

      return product?.price === null;
    });

    if (unavailableProductId) {
      return next(
        new BadRequestError(`Товар с id ${unavailableProductId} не продается`),
      );
    }

    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price ?? 0),
      0,
    );

    if (calculatedTotal !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    const id = faker.string.uuid();

    return res.status(200).send({
      id,
      total: calculatedTotal,
    });
  } catch (err) {
    return next(err);
  }
};

export default createOrder;
