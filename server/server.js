const express = require('express');
const cors = require('cors');
const appRouter = require('./Routes/appRoute');
const expRoute = require('./Routes/expenseRoute');
const budgetRoute = require('./Routes/budgetRoute');
const pool = require('./db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // ✅ call it as a function

// Routes
app.use("/users", appRouter);
app.use("/expense", expRoute);
app.use("/budget", budgetRoute);

const PORT = process.env.PORT || 3000;

// Test DB connection once when starting
app.listen(PORT, () => {
    console.log(`🚀 Listening on port ${PORT}`)
})
