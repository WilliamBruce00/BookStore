import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const ProductRouter = Router();

ProductRouter.get("/", ProductController.findAll);
ProductRouter.get("/:id", ProductController.findID);
ProductRouter.patch("/:id", ProductController.update);
ProductRouter.delete("/:id", ProductController.delete);
ProductRouter.post("/", ProductController.create);

export { ProductRouter };
