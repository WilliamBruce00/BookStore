import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const UserRouter = Router();

UserRouter.get("/", UserController.findAll);
UserRouter.get("/:id", UserController.findOne);
UserRouter.patch("/:id", UserController.update);
UserRouter.delete("/:id", UserController.delete);
UserRouter.post("/", UserController.create);
UserRouter.patch("/changePassword/:id", UserController.changePassword);

export { UserRouter };
