import express from "express";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";
import { ProductRouter } from "./src/routes/product.route";
import { CategoryRouter } from "./src/routes/category.route";
import { UserRouter } from "./src/routes/user.route";
import { MailerRouter } from "./src/routes/mailer.route";
import { AuthRouter } from "./src/routes/auth.route";
import { CartRouter } from "./src/routes/cart.route";
import { ReviewRouter } from "./src/routes/review.route";
import { OrderRouter } from "./src/routes/order.route";
import { uploadRouter } from "./src/routes/upload.route";
import path from "path";

config();

const app = express();
const PORT = process.env.PORT;

const imagePath = path.join(__dirname, "images");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api/product", ProductRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/user", UserRouter);
app.use("/api/cart", CartRouter);
app.use("/api/review", ReviewRouter);
app.use("/api/order", OrderRouter);
app.use("/api/email", MailerRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/images", express.static(imagePath));
