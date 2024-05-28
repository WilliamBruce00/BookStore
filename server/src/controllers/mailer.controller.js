import { MailerModel } from "../models/mailer.model";

export class MailerController {
  constructor() {}

  static async sendMail(req, res) {
    const data = await MailerModel.sendMail(req.body);
    res.status(200).json(data);
  }
}
