const Pool = require('pg').Pool;
require('dotenv').config()


const pool = new Pool({
    connectionString: process.env.DB_URI
})
pool.connect()
    .then(() => { console.log("DB connected successfully"); })
    .catch((err) => { console.log(err.message); })

module.exports = pool