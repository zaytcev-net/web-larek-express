import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products";
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId
} from "../middlewares/validation";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/", getProducts);

router.post("/", auth, validateCreateProduct, createProduct);

router.patch("/:productId", auth, validateProductId, validateUpdateProduct, updateProduct);

router.delete("/:productId", auth, validateProductId, deleteProduct);

export default router;
