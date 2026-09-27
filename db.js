const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",
    port:3306,
    user: "root",
    password: "",
    database: "sneakers_db"
});

db.connect((err) => {

    if (err) {
        console.error("Database connection failed:", err);
        return;
    }

    console.log("Connected to MySQL database!");
});

module.exports = db;