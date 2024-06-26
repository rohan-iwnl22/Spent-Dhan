const express = require('express')
const cors = require('cors')
const appRouter = require('./Routes/appRoute')
const expRoute = require('./Routes/expenseRoute')
require('dotenv').config()


const app = express()
app.use(express.json())

const PORT = process.env.PORT


app.use("/users", appRouter)
app.use("/expense", expRoute)

app.listen(PORT, () => { console.log(`Listening on port ${PORT}`) })


