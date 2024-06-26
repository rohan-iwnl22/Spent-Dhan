const express = require('express');
const expRoute = express.Router();
const authenticateToken = require('../middleware/auth');
const { expenseSchema } = require('../models/Schema');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

expRoute.get('/getExpense', authenticateToken, async (req, res) => {
    cc
    const response = await prisma.expense.findMany({
        where: { userId: userId }
    })

    res.status(200).json(response)
})

expRoute.post('/putExpense', authenticateToken, async (req, res) => {
    let { amount, description, date } = req.body;
    const userId = req.user.userId;  // Extract userId from the authenticated user

    try {
        amount = Number(amount);
        if (isNaN(amount)) {
            return res.status(400).json({ message: "Amount must be a number" });
        }
        date = new Date(date);

        // Include userId in the validation
        const validateExpense = expenseSchema.parse({ amount, description, date, userId });

        await prisma.expense.create({
            data: {
                amount: validateExpense.amount,
                description: validateExpense.description,
                date: validateExpense.date,
                userId: validateExpense.userId
            }
        });
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
