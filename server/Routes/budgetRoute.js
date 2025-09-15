const express = require('express');
const budgetRoute = express.Router();
const authenticateToken = require('../middleware/auth');
const { z } = require('zod');
const pool = require('../db'); // pg pool
const { budgetSchema } = require('../Models/Schema');

// 🔹 GET Budget (fetch latest budget for logged-in user)
budgetRoute.get("/getBudget", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT * FROM budget 
             WHERE userId = $1 
             ORDER BY year DESC, month DESC, id DESC 
             LIMIT 1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No budget found for this user" });
        }

        res.status(200).json({ budget: result.rows[0] });
    } catch (error) {
        console.error("❌ Error fetching budget:", error.message);
        res.status(500).json({ message: "Server error while fetching budget" });
    }
});

// 🔹 POST Budget (create a new budget entry)
budgetRoute.post("/setBudget", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    let { amount, month, year } = req.body;

    try {
        // force numeric conversion
        amount = Number(amount);
        month = Number(month);
        year = Number(year);

        if ([amount, month, year].some(v => isNaN(v))) {
            return res.status(400).json({ message: "amount, month, and year must be valid numbers" });
        }

        // ✅ validate with Zod schema
        const validated = budgetSchema.parse({ amount, month, year, userId });

        // 🔍 check if budget already exists for this (userId, month, year)
        const existing = await pool.query(
            `SELECT id FROM budget 
             WHERE userId = $1 AND month = $2 AND year = $3`,
            [userId, month, year]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ message: "Budget already exists for this month and year" });
        }

        // insert new budget
        const insertResult = await pool.query(
            `INSERT INTO budget (userId, amount, month, year) 
             VALUES ($1, $2, $3, $4) 
             RETURNING *`,
            [validated.userId, validated.amount, validated.month, validated.year]
        );

        res.status(201).json({
            message: "Budget created successfully",
            budget: insertResult.rows[0],
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({ errors: err.errors });
        }
        console.error("❌ Error creating budget:", err.message);
        res.status(500).json({ message: "Server error while creating budget" });
    }
});

module.exports = budgetRoute;
