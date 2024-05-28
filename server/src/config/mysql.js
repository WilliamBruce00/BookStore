import mysql from "mysql";
import util from "util";

export function MySql() {
  const pool = mysql.createPool({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  pool.query = util.promisify(pool.query).bind(pool);
  return pool;
}
