const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    connectTimeout: 10000
});

console.log("Trying to connect to MySQL...");

connection.connect((err) => {
    if (err) {
        console.error("ERROR:", err);
        return;
    }

    console.log("CONNECTED!");

    connection.query(
        "CREATE DATABASE IF NOT EXISTS sneakers_db",
        (err) => {
            if (err) {
                console.error("DATABASE ERROR:", err);
            } else {
                console.log("sneakers_db created!");
            }

            connection.end();
        }
    );
});