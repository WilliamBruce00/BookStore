import { ProductModel } from "../models/product.model";

export class ProductController {
  constructor() {}

  static async findAll(req, res) {
    const data = await ProductModel.findAll();
    res.status(200).json(data);
  }

  static async findID(req, res) {
    const data = await ProductModel.findID(req.params.id);
    res.status(200).json(data);
  }

  static async update(req, res) {
    const data = await ProductModel.update(req.params.id, req.body);
    res.status(200).json(data);
  }

  static async delete(req, res) {
    const data = await ProductModel.delete(req.params.id);
    res.status(200).json(data);
  }

  static async create(req, res) {
    const data = await ProductModel.create(req.body);
    res.status(200).json(data);
  }
}
