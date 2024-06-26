const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { userSchema } = require('../models/Schema');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const appRouter = express.Router();
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET

appRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.users.findUnique({
            where: { email }
        })
        if (!user) {
            res.status(400).json({ message: "Invalid Username or Password" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid username or Password" })
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' })

        res.status(200).json({ message: 'Login successful', token });
    }
    catch (e) {
        res.status(500).json({ message: `An unknown error occured ${e.message}` })
    }
});

appRouter.post('/signin', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const validateData = userSchema.parse({ username, email, password });
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(validateData.password, saltRounds);

        const newUser = await prisma.users.create({
            data: {
                username: validateData.username,
                email: validateData.email,
                password: hashedPassword
            }
        });

        res.status(200).json({ message: "User registered successfully", user: newUser });
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({ errors: e.errors });
        } else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});

module.exports = appRouter;
