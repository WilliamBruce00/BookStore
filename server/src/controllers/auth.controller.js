import { AuthModel } from "../models/auth.model";

export class AuthController {
  constructor() {}

  static async login(req, res) {
    const data = await AuthModel.login(req.body);
    res.status(200).json(data);
  }

  static async verifyToken(req, res) {
    const token = req.headers.authorization.split(" ")[1];
    const data = await AuthModel.verifyToken(token);

    res.status(200).json(data);
  }
}
