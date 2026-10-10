const pool = require("../config/db");
const axios = require("axios");
const {
    tankUpdatesTotal,
    tanksTotalGauge
} = require("../config/metrics");

const notifyLevelCheck = async (tank, previousLevel = null) => {
    try {
        const url = process.env.NOTIFICATION_SERVICE_URL || "http://notification-service:3002";
        const payload = {
            tank_name: tank.tank_name,
            water_level: Number(tank.water_level)
        };
        if (previousLevel !== null && previousLevel !== undefined) {
            payload.previous_water_level = Number(previousLevel);
        }
        const response = await axios.post(
            `${url}/api/notifications/check`,
            payload
        );
        console.log("Notification:", response.data);
        return response.data;
    } catch (notificationError) {
        console.error(
            "Failed to contact Notification Service:",
            notificationError.message
        );
    }
};

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

        const newTank = result.rows[0];
        await notifyLevelCheck(newTank);

        res.status(201).json(newTank);

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

        const currentTankResult = await pool.query(
            "SELECT * FROM tanks WHERE id = $1",
            [id]
        );

        if (currentTankResult.rows.length === 0) {
            return res.status(404).json({
                message: "Tank not found"
            });
        }

        const previousLevel = Number(currentTankResult.rows[0].water_level);

        const result = await pool.query(
            `
            UPDATE tanks
            SET water_level = $1
            WHERE id = $2
            RETURNING *
            `,
            [water_level, id]
        );

        const updatedTank = result.rows[0];
        tankUpdatesTotal.inc({
            service: "tank-service"
        });

        await notifyLevelCheck(updatedTank, previousLevel);

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
