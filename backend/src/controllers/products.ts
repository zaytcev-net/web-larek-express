import { Request, Response, NextFunction } from "express";
import Product from "../models/product";
import path from "path";
import { NotFoundError } from "../errors/not-found-error";
import { moveFileToImages } from "../utils/file";
import fs from "fs/promises";

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
    if (req.body.image?.fileName) {
      const fileName = path.basename(req.body.image.fileName);

      await moveFileToImages(fileName);

      req.body.image.fileName = `/images/${fileName}`;
    }

    const product = await Product.create(req.body);

    return res.status(201).send(product);
  } catch (error) {
    return next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new NotFoundError("Товар не найден"));
    }

    if (req.body.image?.fileName) {
      const fileName = path.basename(req.body.image.fileName);

      await moveFileToImages(fileName);

      req.body.image.fileName = `/images/${fileName}`;
    }

    Object.assign(product, req.body);

    await product.save();

    return res.status(200).send(product);
  } catch (error) {
    return next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return next(new NotFoundError("Товар не найден"));
    }

    return res.status(200).send(product);
  } catch (error) {
    return next(error);
  }
};
