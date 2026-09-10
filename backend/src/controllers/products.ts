import { Request, Response, NextFunction } from "express";
import Product from "../models/product";

export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      items: products,
      total: products.length,
    });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).send(product);
  } catch (error) {
    return next(error);
  }
};
