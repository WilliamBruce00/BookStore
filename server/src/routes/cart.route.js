import { Router } from "express";
import { CartController } from "../controllers/cart.controller";

const CartRouter = Router();

CartRouter.get("/:id", CartController.findbyUserID);
CartRouter.patch("/:id", CartController.updateQuantity);
CartRouter.delete("/:id", CartController.delete);
CartRouter.post("/", CartController.create);

export { CartRouter };
