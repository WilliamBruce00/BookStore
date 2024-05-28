import { upload } from "../config/multer";

const { Router } = require("express");
const { CategoryController } = require("../controllers/category.controller");

const CategoryRouter = Router();

CategoryRouter.get("/", CategoryController.findAll);
CategoryRouter.get("/:id", CategoryController.findID);
CategoryRouter.patch("/:id", CategoryController.update);
CategoryRouter.delete("/:id", CategoryController.delete);
CategoryRouter.post("/", CategoryController.create);

export { CategoryRouter };
