const pool = require("../config/db");
const {
    lowWaterAlertsTotal
} = require("../config/metrics");
const {
    sendAlertNotifications
} = require("../config/notifiers");

const checkWaterLevel = async (req, res) => {
    try {

        if (!req.body) {
            return res.status(400).json({
                message: "Request body missing"
            });
        }

        const { tank_name, water_level } = req.body;

        if (!tank_name || water_level === undefined) {
            return res.status(400).json({
                message: "tank_name and water_level required"
            });
        }
        console.log(
    `Tank ${tank_name} checked. Level = ${water_level}%`
);

        if (water_level < 20) {

    console.log(
        `LOW WATER ALERT: ${tank_name} level is ${water_level}%`
    );

    await pool.query(
        `
        INSERT INTO alerts
        (
            tank_name,
            water_level,
            alert_type
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        `,
        [
            tank_name,
            water_level,
            "LOW_WATER_LEVEL"
        ]
    );

    lowWaterAlertsTotal.inc({
        service: "notification-service"
    });

    await sendAlertNotifications({
        tank_name,
        water_level
    });

    return res.json({
        tank_name,
        water_level,
        alert: "LOW_WATER_LEVEL"
    });
}

        return res.json({
            tank_name,
            water_level,
            alert: "NORMAL"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Notification check failed"
        });
    }
};

module.exports = {
    checkWaterLevel
};
