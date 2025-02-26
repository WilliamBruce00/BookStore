import { MySql } from "../config/mysql";
import bcrypt from "bcrypt";

export class UserModel {
  constructor() {}

  static async findAll() {
    const db = await MySql();

    try {
      const query = "SELECT * FROM users";
      const result = await db.query(query);

      return result;
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async findOne(id) {
    const db = await MySql();

    try {
      const query = "SELECT * FROM users WHERE id = ?";
      const result = await db.query(query, [id]);

      if (!result[0]) {
        return {
          status: "error",
          message: "User Not Found",
        };
      }

      return result[0];
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async update(id, data) {
    const db = await MySql();

    try {
      const query = "UPDATE users SET ? WHERE id = ?";
      const result = await db.query(query, [data, id]);

      if (result.affectedRows === 1) {
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
      const query = "DELETE FROM users WHERE id  = ?";
      const result = await db.query(query, [id]);

      if (result.affectedRows === 1) {
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
      const { email, password } = data;

      const hash = await bcrypt.hash(password, 10);

      const query = "INSERT INTO users(email,password) VALUES (?,?)";
      const result = await db.query(query, [email, hash]);

      if (result.affectedRows === 1) {
        return {
          status: "success",
          message: "Created Successfully",
          response: result,
        };
      } else {
        return {
          status: "error",
          message: "Created Failed",
          response: null,
        };
      }
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async changePassword(id, data) {
    const db = await MySql();

    try {
      const { oldpassword, newpassword } = data;

      const findUser = await db.query("SELECT * FROM users WHERE id = ?", [id]);

      const checkpassword = await bcrypt.compare(
        oldpassword,
        findUser[0].password
      );

      if (!checkpassword) {
        return {
          check: false,
          message: "incorrect password",
        };
      }

      const hash = await bcrypt.hash(newpassword, 10);

      await db.query("UPDATE users SET password = ? WHERE id = ?", [hash, id]);

      return {
        check: true,
        message: "correct password",
      };
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }
}
