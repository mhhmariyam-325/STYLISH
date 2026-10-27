
const express = require("express");
const crypto = require('crypto');
require('dotenv').config();
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./db");
const app = express();
const PORT = 3000;

app.use(express.json());

// Allow requests from the website
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: "sneakers-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));


// Serve website files
app.use(express.static(__dirname));



app.get("/api/products", (req, res) => {
    const sql = `
        SELECT 
            product_id AS id,
            name,
            price,
            stock_qty,
            image_url AS image
        FROM products
        WHERE status = 'active'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error loading products:", err);
            return res.status(500).json({
                error: "Failed to load products"
            });
        }

        res.json(results);
    });
});
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            error: "Please log in first."
        });
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).json({
            error: "Admin access required."
        });
    }

    next();
}
/* ADD PRODUCT */
app.post("/api/products", requireAdmin,(req, res) => {
    const { name, price, stock_qty, image } = req.body;

    if (!name || price == null || stock_qty == null) {
        return res.status(400).json({
            error: "Please provide name, price, and stock quantity."
        });
    }

    const sql = `
        INSERT INTO products
            (name, price, stock_qty, image_url, status)
        VALUES (?, ?, ?, ?, 'active')
    `;

    db.query(sql, [name, price, stock_qty, image || ""], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            return res.status(500).json({
                error: "Failed to add product."
            });
        }

        res.status(201).json({
            message: "Product added successfully.",
            productId: result.insertId
        });
    });
});

/* EDIT PRODUCT */
    app.put("/api/products/:id", requireAdmin, (req, res) => {
    const { name, price, stock_qty, image } = req.body;
    const productId = req.params.id;

    if (!name || price == null || stock_qty == null) {
        return res.status(400).json({
            error: "Please provide name, price, and stock quantity."
        });
    }

    const sql = `
        UPDATE products
        SET name = ?, price = ?, stock_qty = ?, image_url = ?
        WHERE product_id = ?
    `;

    db.query(
        sql,
        [name, price, stock_qty, image || "", productId],
        (err, result) => {
            if (err) {
                console.error("Error updating product:", err);
                return res.status(500).json({
                    error: "Failed to update product."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Product not found."
                });
            }

            res.json({ message: "Product updated successfully." });
        }
    );
});

/* DELETE PRODUCT */
    app.delete("/api/products/:id", requireAdmin, (req, res) => {
    const productId = req.params.id;

    const sql = "DELETE FROM products WHERE product_id = ?";

    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error("Error deleting product:", err);
            return res.status(500).json({
                error: "Failed to delete product."
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Product not found."
            });
        }

        res.json({
            message: "Product deleted successfully."
        });
    });
});

// ===============================
// LOGIN
// ===============================
app.post("/api/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please enter your email and password."
            });

        }


        // Find user in database
        const [users] = await db.promise().query(
            "SELECT user_id, full_name, email, password, role FROM users WHERE email = ?",
            [email]
        );


        // User not found
        if (users.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        // Get user
        const user = users[0];


        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
        return res.status(401).json({
        success: false,
        message: "Invalid email or password."
        });
        }


        
 // Create login session
req.session.user = {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role
};



        // Successful login
        res.json({

            success: true,
            message: "Login successful!",
            user: req.session.user

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server error."

        });

    }

});


// ===============================
// REGISTER
// ===============================

app.post("/api/register", async (req, res) => {
try {

        const {
            fullName,
            email,
            password,
            confirmPassword
        } = req.body;


        // Check fields
        if (!fullName || !email || !password || !confirmPassword) {

            return res.status(400).json({

                success: false,
                message: "Please fill in all fields."

            });

        }


        // Check passwords
        if (password !== confirmPassword) {

            return res.status(400).json({

                success: false,
                message: "Passwords do not match."

            });

        }
        // Check password complexity
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!passwordRegex.test(password)) {

    return res.status(400).json({

        success: false,
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."

    });

}


        // Check whether email already exists
        const [existingUsers] = await db.promise().query(

            "SELECT user_id FROM users WHERE email = ?",

            [email]

        );


        if (existingUsers.length > 0) {

            return res.status(409).json({

                success: false,
                message: "An account with this email already exists."

            });

        }


        // Insert new user into database
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query(

            "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",

            [fullName, email, hashedPassword]

        );


        // Registration successful
        res.status(201).json({

            success: true,
            message: "Registration successful!"

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server error."

        });

    }

});
// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================

function requireLogin(req, res, next) {

    if (req.session.user) {

        next();

    } else {

        res.status(401).json({
            success: false,
            message: "Please login to continue."
        });

    }

}
function requirePageLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login.html?returnUrl=" + encodeURIComponent(req.originalUrl));
    }
}

// ===============================
// CHECK LOGIN SESSION
// ===============================

app.get("/api/session", (req, res) => {
     res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.session.user) {

        return res.json({
            loggedIn: true,
            user: req.session.user
        });

    }

    res.json({
        loggedIn: false
    });

});
// ===============================
// LOGOUT
// ===============================

app.post("/api/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            return res.status(500).json({
                success: false,
                message: "Logout failed."
            });

        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "Logout successful."
        });

    });

});

// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================

function requireLogin(req, res, next) {

    if (req.session.user) {

        next();

    } else {

        res.status(401).json({
            success: false,
            message: "Please login to continue."
        });
        
        
function requireAdmin(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({
            error: "Please log in first."
        });
    }

    if (req.session.user.role !== "admin") {
        return res.status(403).json({
            error: "Admin access required."
        });
    }

    next();
}
    }
}

        // ===============================
// UPDATE USER PROFILE
// ===============================

app.put("/api/profile", requireLogin, async (req, res) => {

    try {

        const userId = req.session.user.user_id;

        const {
            fullName,
            phone,
            shippingAddress,
            billingAddress
        } = req.body;

        if (!fullName) {

            return res.status(400).json({
                success: false,
                message: "Full name is required."
            });

        }

        await db.promise().query(

            `UPDATE users
             SET full_name = ?,
                 phone = ?,
                 shipping_address = ?,
                 billing_address = ?
             WHERE user_id = ?`,

            [
                fullName,
                phone || null,
                shippingAddress || null,
                billingAddress || null,
                userId
            ]

        );
        // ===============================
// CHANGE PASSWORD
// ===============================

app.put("/api/change-password", requireLogin, async (req, res) => {

    try {

        const userId = req.session.user.user_id;

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;


        // Check fields
        if (!currentPassword || !newPassword || !confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all password fields."
            });

        }


        // Check new passwords match
        if (newPassword !== confirmPassword) {

            return res.status(400).json({
                success: false,
                message: "New passwords do not match."
            });

        }


        // Check password complexity
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


        if (!passwordRegex.test(newPassword)) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."

            });

        }


        // Get current password hash
        const [users] = await db.promise().query(

            "SELECT password FROM users WHERE user_id = ?",

            [userId]

        );


        if (users.length === 0) {

            return res.status(404).json({

                success: false,
                message: "User not found."

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                currentPassword,
                users[0].password
            );


        // Current password is incorrect
        if (!passwordMatch) {

            return res.status(401).json({

                success: false,
                message: "Current password is incorrect."

            });

        }


        // Hash new password
        const hashedPassword =
            await bcrypt.hash(newPassword, 10);


        // Save new password
        await db.promise().query(

            "UPDATE users SET password = ? WHERE user_id = ?",

            [hashedPassword, userId]

        );


        res.json({

            success: true,
            message: "Password changed successfully."

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Unable to change password."

        });

    }

});

        // Update name in current login session
        req.session.user.full_name = fullName;

        res.json({

            success: true,
            message: "Profile updated successfully."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Unable to update profile."

        });

    }

});

    



// ===============================
// START SERVER
// ===============================
// Your existing routes
// ...

// PayHere route
app.post('/payhere', (req, res) => {
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    const { order_id, amount, currency } = req.body;

    const formattedAmount = Number(amount).toFixed(2);

    const hashedSecret = crypto
        .createHash('md5')
        .update(merchantSecret)
        .digest('hex')
        .toUpperCase();

    const hash = crypto
        .createHash('md5')
        .update(
            merchantId +
            order_id +
            formattedAmount +
            currency +
            hashedSecret
        )
        .digest('hex')
        .toUpperCase();

    res.json({
        merchant_id: merchantId,
        order_id: order_id,
        amount: formattedAmount,
        currency: currency,
        hash: hash
    });
});

app.post('/api/payhere-notify', (req, res) => {

    console.log("PayHere notification received:");
    console.log(req.body);

    res.sendStatus(200);

});
// app.listen MUST COME AFTER the route

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});