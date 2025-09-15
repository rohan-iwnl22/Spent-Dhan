const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const appRouter = express.Router();
const pool = require('../db'); // pg pool
const { userSchema } = require('../Models/Schema');


const secret = process.env.JWT_SECRET;

// 🔹 LOGIN
appRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // find user by email
        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1 LIMIT 1`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = result.rows[0];

        // validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            secret,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (e) {
        console.error("❌ Error during login:", e.message);
        res.status(500).json({ message: `Server error during login` });
    }
});

// 🔹 SIGNUP
appRouter.post('/signin', async (req, res) => {
    const { username, email, password } = req.body;

    console.log(username, email, password);
    try {
        // validate with Zod

        // check if user already exists
        const existing = await pool.query(
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "User already exists with this email" });
        }

        // hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // insert new user
        const insertResult = await pool.query(
            `INSERT INTO users (username, email, password) 
             VALUES ($1, $2, $3) 
             RETURNING id, username, email, created_at`,
            [username, email, hashedPassword]
        );

        const newUser = insertResult.rows[0];

        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (e) {
        if (e instanceof z.ZodError) {
            return res.status(400).json({ errors: e.errors });
        }
        console.error("❌ Error during signup:", e.message);
        res.status(500).json({ message: "Server error during signup" });
    }
});

module.exports = appRouter;
