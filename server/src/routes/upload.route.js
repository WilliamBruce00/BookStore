import { Router } from "express";
import { upload } from "../config/multer";

const uploadRouter = Router();

uploadRouter.post("/", upload.single("img"), (req, res) => {
  res.json({
    img: req.file.filename,
  });
});

export { uploadRouter };
