import { OrderModel } from "../models/order.model";

export class OrderController {
  constructor() {}

  static async findAll(req, res) {
    const data = await OrderModel.findAll();
    res.status(200).json(data);
  }

  static async findbyUserID(req, res) {
    const data = await OrderModel.findbyUSerID(req.params.id);
    res.status(200).json(data);
  }

  static async create(req, res) {
    const data = await OrderModel.create(req.body);
    res.status(200).json(data);
  }

  static async updateStatus(req, res) {
    const data = await OrderModel.updateStatus(req.params.id, req.body);
    res.status(200).json(data);
  }
}
