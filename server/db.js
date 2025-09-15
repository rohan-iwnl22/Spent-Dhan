const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DB_URI,
});

pool.connect()
    .then(() => {
        console.log("✅ DB connected successfully");
        return initTables();
    })
    .catch((err) => {
        console.error("❌ DB connection failed:", err.message);
    });

// 🔹 Create tables if not present
async function initTables() {
    try {
        // users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ users table ready");

        // budget table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS budget (
                id SERIAL PRIMARY KEY,
                userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
                month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
                year INT NOT NULL CHECK (year BETWEEN 2000 AND 2100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ budget table ready");

        // expense table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expense (
                id SERIAL PRIMARY KEY,
                amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
                description TEXT NOT NULL,
                userId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                date TIMESTAMP NOT NULL,
                mode VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ expense table ready");

    } catch (err) {
        console.error("❌ Error creating tables:", err.message);
    }
}

module.exports = pool;
