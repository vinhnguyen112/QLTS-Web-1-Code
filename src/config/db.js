const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
});

db.getConnection()
  .then((connection) => {
    console.log("Kết nối MySQL thành công!");
    connection.release();
  })
  .catch((err) => {
    console.log("Kết nối MySQL thất bại:", err.message);
  });

module.exports = db;
