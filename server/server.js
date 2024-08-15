const express = require('express')
const cors = require('cors')
const appRouter = require('./Routes/appRoute')
const expRoute = require('./Routes/expenseRoute')
const budgetRoute = require('./Routes/budgetRoute')
const pool = require('./db')
require('dotenv').config()



const app = express()
app.use(express.json())
app.use(cors)

const PORT = process.env.PORT


app.use("/users", appRouter)
app.use("/expense", expRoute)
app.use("/budget", budgetRoute)

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })


