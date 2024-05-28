import { MySql } from "../config/mysql";

export class CategoryModel {
  constructor() {}

  static async findAll() {
    const db = await MySql();

    try {
      const query = "SELECT * FROM categories";
      const result = await db.query(query);

      return result;
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async findID(id) {
    const db = await MySql();

    try {
      const query = "SELECT * FROM categories WHERE id = ?";
      const result = await db.query(query, [id]);

      if (!result[0]) {
        return {
          status: "error",
          message: "Category Not Found",
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
      const query = "UPDATE categories SET ? WHERE id = ?";
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
      const query = "DELETE FROM categories WHERE id = ?";
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
      const { name, img } = data;

      const query = "INSERT INTO categories(name,img) VALUES(?,?)";
      const result = await db.query(query, [name, img]);

      if (result.affectedRows === 1) {
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
