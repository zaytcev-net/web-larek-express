import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import Product from "../models/product";
import { BadRequestError } from "../errors/bad-request-error";

interface OrderBody {
  payment: "card" | "online";
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export const createOrder = async (
  req: Request<{}, {}, OrderBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { items, total } = req.body;

    // Проверяем ID товаров
    for (const itemId of items) {
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return next(new BadRequestError("Передан не валидный ID товара"));
      }
    }

    // Получаем товары из базы
    const products = await Product.find({
      _id: { $in: items },
    });

    // Проверяем существование каждого товара
    for (const itemId of items) {
      const product = products.find((item) => item._id.toString() === itemId);

      if (!product) {
        return next(new BadRequestError(`Товар с id ${itemId} не найден`));
      }

      // Проверяем, продаётся ли товар
      if (product.price === null) {
        return next(new BadRequestError(`Товар с id ${itemId} не продается`));
      }
    }

    // Считаем настоящую сумму заказа
    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price ?? 0),
      0,
    );

    // Проверяем total
    if (calculatedTotal !== total) {
      return next(new BadRequestError("Неверная сумма заказа"));
    }

    // Заказ в БД НЕ сохраняем
    const id = faker.string.uuid();

    return res.status(200).send({
      id,
      total: calculatedTotal,
    });
  } catch (err) {
    return next(err);
  }
};
