const pool = require("../config/db");
const bcrypt = require("bcrypt");
const {
    userRegistrationsTotal
} = require("../config/metrics");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

const result = await pool.query(
    `INSERT INTO users(name,email,password)
     VALUES($1,$2,$3)
     RETURNING id,name,email,created_at`,
    [name, email, hashedPassword]
);

        userRegistrationsTotal.inc({
            service: "user-service"
        });

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Registration Failed"
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT id,name,email,created_at FROM users"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch users"
        });
    }
};

module.exports = {
    registerUser,
    getUsers
};
