const express = require('express');
const expRoute = express.Router();
const authenticateToken = require('../middleware/auth');
const { z } = require('zod');
const pool = require('../db'); // ✅ Import pg pool
const { expenseSchema } = require('../Models/Schema');

// ✅ Get all expenses for the logged-in user
expRoute.get('/getExpense', authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            'SELECT * FROM expenses WHERE userId = $1 ORDER BY date DESC',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No expenses found" });
        }

        res.status(200).json(result.rows);
    } catch (e) {
        console.error("Error fetching expenses:", e);
        res.status(500).json({ message: "An unknown error occurred" });
    }
});

// ✅ Add a new expense
expRoute.post('/putExpense', authenticateToken, async (req, res) => {
    let { amount, description, date, mode } = req.body;
    const userId = req.user.userId;

    try {
        // Validate amount
        amount = Number(amount);
        if (isNaN(amount)) {
            return res.status(400).json({ message: "Amount must be a number" });
        }

        // Validate date
        date = new Date(date);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        // Normalize payment mode
        mode = mode.toUpperCase();
        if (!["GPAY", "CASH"].includes(mode)) {
            return res.status(400).json({ message: "Payment mode must be GPAY or CASH" });
        }

        // ✅ Validate with Zod (including userId)
        const validatedExpense = expenseSchema.parse({
            amount,
            description,
            date,
            userId,
            mode
        });

        // Insert into DB
        await pool.query(
            `INSERT INTO expenses (amount, description, date, userId, mode) 
             VALUES ($1, $2, $3, $4, $5)`,
            [
                validatedExpense.amount,
                validatedExpense.description,
                validatedExpense.date,
                validatedExpense.userId,
                validatedExpense.mode
            ]
        );

        res.status(200).json({ message: "Entry Successful" });
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({ errors: e.errors });
        } else {
            console.error("Error creating expense:", e);
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});

module.exports = expRoute;
