import { CartModel } from "../models/cart.model";

export class CartController {
  constructor() {}

  static async findbyUserID(req, res) {
    const data = await CartModel.findbyUserID(req.params.id);
    res.status(200).json(data);
  }

  static async updateQuantity(req, res) {
    const data = await CartModel.updateQuantity(req.params.id, req.body);
    res.status(200).json(data);
  }

  static async delete(req, res) {
    const data = await CartModel.delete(req.params.id);
    res.status(200).json(data);
  }

  static async create(req, res) {
    const data = await CartModel.create(req.body);
    res.status(200).json(data);
  }
}
