import { MySql } from "../config/mysql";

export class OrderModel {
  constructor() {}

  static async findAll() {
    const db = await MySql();

    try {
      const [orders, details] = await Promise.all([
        db.query("SELECT * FROM orders"),
        db.query("SELECT * FROM orderdetails"),
      ]);

      const result = orders.map((or) => {
        return {
          ...or,
          details: details.filter((ordt) => ordt.orderID === or.id),
        };
      });

      return result;
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async findbyUSerID(id) {
    const db = await MySql();

    try {
      const [orders, details, products] = await Promise.all([
        db.query("SELECT * FROM orders WHERE userID = ?", [id]),
        db.query("SELECT * FROM orderdetails"),
        db.query("SELECT * FROM products"),
      ]);

      if (orders.length === 0) {
        return {
          status: "Not Found",
          code: 404,
          data: null,
        };
      }

      const result = orders.map((or) => {
        return {
          ...or,
          details: details
            .filter((ordt) => ordt.orderID === or.id)
            .map((ordt) => {
              return {
                ...products.find((prod) => prod.id === ordt.productID),
                quantity: ordt.quantity,
              };
            }),
        };
      });

      return result;
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async create(data) {
    const db = await MySql();

    try {
      const {
        fullname,
        phone,
        address,
        total,
        createAt,
        status,
        userID,
        details,
      } = data;

      const orders = await db.query(
        "INSERT INTO orders(fullname,phone,address,total,createAt, status,userID) VALUES (?,?,?,?,?,?,?)",
        [fullname, phone, address, total, createAt, status, userID]
      );

      await Promise.all(
        details.map((item) => {
          return db.query(
            "INSERT INTO orderdetails(orderID, productID, quantity) VALUES (?,?,?)",
            [orders.insertId, item.id, item.quantity]
          );
        })
      );

      return {
        status: "Created",
        code: 201,
        message: "Created Successfully",
      };
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async updateStatus(id, data) {
    const db = await MySql();

    try {
      const { status } = data;

      const orders = await db.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [status, id]
      );

      // if (orders.affectedRows === 1) {
      //   return {
      //     status: "success",
      //     message: "Updated Successfully",
      //   };
      // } else {
      //   return {
      //     status: "error",
      //     message: "Updated Failed",
      //   };
      // }
      return {
        status: "OK",
        code: 200,
        message: "Updated Successfully",
      };
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }
}
