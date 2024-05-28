import { CategoryModel } from "../models/category.model";

export class CategoryController {
  constructor() {}

  static async findAll(req, res) {
    const data = await CategoryModel.findAll();
    res.status(200).json(data);
  }

  static async findID(req, res) {
    const data = await CategoryModel.findID(req.params.id);
    res.status(200).json(data);
  }

  static async update(req, res) {
    const data = await CategoryModel.update(req.params.id, req.body);
    res.status(200).json(data);
  }

  static async delete(req, res) {
    const data = await CategoryModel.delete(req.params.id);
    res.status(200).json(data);
  }

  static async create(req, res) {
    const data = await CategoryModel.create(req.body);
    res.status(200).json(data);
  }
}
