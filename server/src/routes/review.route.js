import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";

const ReviewRouter = Router();

ReviewRouter.get("/user/:id", ReviewController.findbyUserID);
ReviewRouter.get("/product/:id", ReviewController.findbyProductID);
ReviewRouter.patch("/:id", ReviewController.update);
ReviewRouter.post("/", ReviewController.create);

export { ReviewRouter };
