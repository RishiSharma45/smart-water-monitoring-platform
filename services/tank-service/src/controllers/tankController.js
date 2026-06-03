const pool = require("../config/db");
const axios = require("axios");
const {
    tankUpdatesTotal,
    tanksTotalGauge
} = require("../config/metrics");

const createTank = async (req, res) => {
    try {
        const { tank_name, water_level } = req.body;

        const result = await pool.query(
            `INSERT INTO tanks(tank_name, water_level)
             VALUES($1, $2)
             RETURNING *`,
            [tank_name, water_level]
        );

        const countResult = await pool.query("SELECT COUNT(*) FROM tanks");
        tanksTotalGauge.set(
            {
                service: "tank-service"
            },
            Number(countResult.rows[0].count)
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Tank creation failed"
        });
    }
};

const getTanks = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT * FROM tanks
             ORDER BY id ASC`
        );

        tanksTotalGauge.set(
            {
                service: "tank-service"
            },
            result.rows.length
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch tanks"
        });
    }
};

const updateTankLevel = async (req, res) => {
    try {

        const { id } = req.params;
        const { water_level } = req.body;

        const result = await pool.query(
            `
            UPDATE tanks
            SET water_level = $1
            WHERE id = $2
            RETURNING *
            `,
            [water_level, id]
        );

        if (result.rows.length === 0) {
    return res.status(404).json({
        message: "Tank not found"
    });
}

const updatedTank = result.rows[0];
tankUpdatesTotal.inc({
    service: "tank-service"
});

try {
    const notificationResponse = await axios.post(
        `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/check`,
        {
            tank_name: updatedTank.tank_name,
            water_level: updatedTank.water_level
        }
    );

    console.log("Notification:", notificationResponse.data);

} catch (notificationError) {
    console.error(
        "Failed to contact Notification Service:",
        notificationError.message
    );
}

res.json(updatedTank);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update tank"
        });
    }
};

module.exports = {
    createTank,
    getTanks,
    updateTankLevel
};
