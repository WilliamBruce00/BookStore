import { MySql } from "../config/mysql";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { promisify } from "util";

export class AuthModel {
  constructor() {}

  static async login(data) {
    const db = await MySql();

    const signAsync = promisify(sign);

    try {
      const { email, password } = data;

      const emailQuery = "SELECT * FROM users WHERE email = ?";
      const resultEmail = await db.query(emailQuery, [email]);

      if (!resultEmail[0]) {
        return {
          status: "error",
          message: "Email hoặc mật khẩu không chính xắc",
          token: null,
        };
      }

      const resultPassword = await bcrypt.compare(
        password,
        resultEmail[0].password
      );

      if (!resultPassword) {
        return {
          status: "error",
          message: "Email hoặc mật khẩu không chính xắc",
          token: null,
        };
      }

      return {
        status: "success",
        message: "Đăng nhập thành công",
        token: await signAsync({ ...resultEmail[0] }, "tien123", {
          expiresIn: "30m",
        }),
      };
    } catch (error) {
      throw error;
    } finally {
      db.end();
    }
  }

  static async verifyToken(token) {
    const db = await MySql();
    const verifyAsync = promisify(verify);

    try {
      const decoded = await verifyAsync(token, "tien123");
      return decoded;
    } catch (error) {
    } finally {
      db.end();
    }
  }
}
