import { Router } from "express";
import { createOrder } from "../controllers/order";
import { validateCreateOrder } from "../middlewares/validation";

const orderRouter = Router();

orderRouter.post("/", validateCreateOrder, createOrder);

export default orderRouter;
