import { MySql } from "../config/mysql";

export class CartModel {
  constructor() {}

  static async findbyUserID(id) {
    const db = await MySql();

    try {
      const cart = await db.query("SELECT * FROM cart WHERE userID = ?", [id]);

      return cart;
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async updateQuantity(id, data) {
    const db = await MySql();

    try {
      const { quantity } = data;

      const cart = await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [
        quantity,
        id,
      ]);

      if (cart.affectedRows === 1) {
        return {
          status: "success",
          message: "Updated Successfully",
        };
      } else {
        return {
          status: "error",
          message: "Updated Failed",
        };
      }
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async delete(id) {
    const db = await MySql();

    try {
      const cart = await db.query("DELETE FROM cart WHERE id = ?", [id]);

      if (cart.affectedRows === 1) {
        return {
          status: "success",
          message: "Deleted Successfully",
        };
      } else {
        return {
          status: "error",
          message: "Deleted Failed",
        };
      }
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async create(data) {
    const db = await MySql();

    try {
      const { userID, productID, quantity } = data;

      const cart = await db.query(
        "INSERT INTO cart(userID,productID,quantity) VALUES (?,?,?)",
        [userID, productID, quantity]
      );

      if (cart.affectedRows === 1) {
        return {
          status: "success",
          message: "Created Successfully",
        };
      } else {
        return {
          status: "error",
          message: "Created Failed",
        };
      }
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }
}
