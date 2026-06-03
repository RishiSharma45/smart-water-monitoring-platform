const pool = require("../config/db");

const getAlerts = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT *
            FROM alerts
            ORDER BY id DESC
            `
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch alerts"
        });
    }
};

module.exports = {
    getAlerts
};