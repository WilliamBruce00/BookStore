import { Router } from "express";
import { OrderController } from "../controllers/order.controller";

const OrderRouter = Router();

OrderRouter.get("/", OrderController.findAll);
OrderRouter.get("/:id", OrderController.findbyUserID);
OrderRouter.post("/", OrderController.create);
OrderRouter.patch("/:id", OrderController.updateStatus);

export { OrderRouter };
