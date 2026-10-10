const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
});

module.exports = pool;