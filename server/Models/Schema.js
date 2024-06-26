const { z } = require('zod')

const userSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

const expenseSchema = z.object({
    id: z.number().optional(), // Optional because it is auto-generated
    amount: z.number().positive("Amount must be positive"),
    description: z.string().min(1, "Description is required"),
    userId: z.number(),
    date: z.date(),
});

const budgetSchema = z.object({
    id: z.number().optional(), // Optional because it is auto-generated
    userId: z.number(),
    amount: z.number().positive("Amount must be positive"),
    month: z.number().int().min(1).max(12, "Month must be between 1 and 12"),
    year: z.number().int().min(2000).max(2100, "Year must be between 2000 and 2100"),
});

module.exports = {
    userSchema, expenseSchema, budgetSchema
}