import { UserModel } from "../models/user.model";

export class UserController {
  constructor() {}

  static async findAll(req, res) {
    const data = await UserModel.findAll();
    res.status(200).json(data);
  }

  static async findOne(req, res) {
    const data = await UserModel.findOne(req.params.id);
    res.status(200).json(data);
  }

  static async update(req, res) {
    const data = await UserModel.update(req.params.id, req.body);
    res.status(200).json(data);
  }

  static async delete(req, res) {
    const data = await UserModel.delete(req.params.id);
    res.status(200).json(data);
  }

  static async create(req, res) {
    const data = await UserModel.create(req.body);
    res.status(200).json(data);
  }

  static async changePassword(req, res) {
    const data = await UserModel.changePassword(req.params.id, req.body);
    res.status(200).json(data);
  }
}
