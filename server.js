const express = require("express");
const session = require("express-session");
const db = require("./db");

const app = express();
const PORT = 3000;


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
            "SELECT user_id, full_name, email, password FROM users WHERE email = ?",
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
        if (user.password !== password) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        // Create login session
        req.session.user = {

            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email

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
        await db.promise().query(

            "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",

            [fullName, email, password]

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
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});