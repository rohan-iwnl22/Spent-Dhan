const express = require('express');
const budgetRoute = express.Router();
const authenticateToken = require('../middleware/auth');
const { budgetSchema } = require('../models/Schema');
const { z } = require('zod');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// retrieving the budget that has been set
budgetRoute.get("/getBudget", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    const response = await prisma.budget.findFirst({
        where: {
            userId: userId
        }
    })
    if (response) {
        res.status(200).json({ response })
    } else {
        res.status(500).json({ message: "An unknown error occured" })
    }
})

// setting the budget
budgetRoute.post('/setBudget', authenticateToken, async (req, res) => {
    const userId = req.user.userId
    let { amount, month, year } = req.body;
    try {
        amount = Number(amount);
        month = Number(month);
        year = Number(year);
        if (isNaN(amount) || isNaN(month) || isNaN(year)) {
            res.status(500).json({ message: "Value entered must be a number" });
        }

        const validateResponse = budgetSchema.parse({ amount, month, year, userId });

        await prisma.budget.create({
            data: {
                amount: validateResponse.amount,
                month: validateResponse.month,
                year: validateResponse.year,
                userId: validateResponse.userId,
            }
        })

        res.status(200).json({ message: "Budget Entered Successfully" })

    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({ errors: e.errors });
        } else {
            console.error("Error creating expense:", e);
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }

})


module.exports = budgetRoute