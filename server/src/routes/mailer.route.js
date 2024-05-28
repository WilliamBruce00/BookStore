import { Router } from "express";
import { MailerController } from "../controllers/mailer.controller";

const MailerRouter = Router();

MailerRouter.post("/", MailerController.sendMail);

export { MailerRouter };
