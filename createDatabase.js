const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "",
    database: "sneakers_db"
});

console.log("Trying to connect to MySQL...");

connection.connect((err) => {

    if (err) {
        console.error("ERROR:", err);
        return;
    }

    console.log("CONNECTED!");

    const queries = [

        // Add role to existing users table
        `ALTER TABLE users
         ADD COLUMN role VARCHAR(20) DEFAULT 'customer'`,

        // Products table
        `CREATE TABLE IF NOT EXISTS products (
            product_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            stock_qty INT NOT NULL DEFAULT 0,
            image_url VARCHAR(500),
            status VARCHAR(20) DEFAULT 'active'
        )`,

        // Orders table
        `CREATE TABLE IF NOT EXISTS orders (
            order_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(30) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`,

        // Order items table
        `CREATE TABLE IF NOT EXISTS order_items (
            order_item_id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            unit_price DECIMAL(10,2) NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(order_id),
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        )`

    ];

    let index = 0;

    function runNext() {

        if (index >= queries.length) {

            console.log("Week 08 database setup completed!");
            connection.end();
            return;
        }

        connection.query(queries[index], (err) => {

            if (err) {

                // Ignore error if role already exists
                if (
                    index === 0 &&
                    err.code === "ER_DUP_FIELDNAME"
                ) {
                    console.log("Role column already exists.");
                    index++;
                    runNext();
                    return;
                }

                console.error("DATABASE ERROR:", err);
                connection.end();
                return;
            }

            console.log("Step " + (index + 1) + " completed.");

            index++;
            runNext();
        });
    }

    runNext();
});