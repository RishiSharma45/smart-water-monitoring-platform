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

        const { tank_name, water_level, previous_water_level } = req.body;

        if (!tank_name || water_level === undefined) {
            return res.status(400).json({
                message: "tank_name and water_level required"
            });
        }

        const numericLevel = Number(water_level);
        const LOW_WATER_THRESHOLD = parseInt(process.env.LOW_WATER_THRESHOLD, 10) || 20;

        console.log(
            `Tank ${tank_name} checked. Level = ${numericLevel}% (threshold = ${LOW_WATER_THRESHOLD}%)`
        );

        // If water level is at or above the threshold, normal condition
        if (numericLevel >= LOW_WATER_THRESHOLD) {
            return res.json({
                tank_name,
                water_level: numericLevel,
                alert: "NORMAL"
            });
        }

        // Water level is below the threshold (< 20%)
        // If previous_water_level was provided and was already below threshold,
        // the tank was already in a low-water state and has not newly crossed the threshold.
        if (previous_water_level !== undefined && previous_water_level !== null) {
            const prev = Number(previous_water_level);
            if (prev < LOW_WATER_THRESHOLD) {
                console.log(
                    `Tank ${tank_name} was already below threshold (${prev}% -> ${numericLevel}%). Suppressing duplicate alert.`
                );
                return res.json({
                    tank_name,
                    water_level: numericLevel,
                    alert: "LOW_WATER_LEVEL",
                    threshold_crossed: false,
                    message: "Tank was already below threshold; alert already recorded."
                });
            }
        }

        // Check for recent duplicate alert to prevent repeated requests or retries
        // within a short window (5 seconds with identical level)
        const recentAlert = await pool.query(
            `
            SELECT id, water_level, created_at
            FROM alerts
            WHERE tank_name = $1 AND alert_type = 'LOW_WATER_LEVEL'
            ORDER BY created_at DESC, id DESC
            LIMIT 1
            `,
            [tank_name]
        );

        if (recentAlert.rows.length > 0) {
            const last = recentAlert.rows[0];
            const timeDiffMs = Date.now() - new Date(last.created_at).getTime();
            if (timeDiffMs < 5000 && Number(last.water_level) === numericLevel) {
                console.log(
                    `Duplicate alert for ${tank_name} at ${numericLevel}% suppressed (retry within ${timeDiffMs}ms).`
                );
                return res.json({
                    tank_name,
                    water_level: numericLevel,
                    alert: "LOW_WATER_LEVEL",
                    threshold_crossed: false,
                    message: "Duplicate alert suppressed (recent retry)."
                });
            }
        }

        console.log(
            `LOW WATER ALERT: ${tank_name} level is ${numericLevel}% (threshold crossed)`
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
                numericLevel,
                "LOW_WATER_LEVEL"
            ]
        );

        lowWaterAlertsTotal.inc({
            service: "notification-service"
        });

        await sendAlertNotifications({
            tank_name,
            water_level: numericLevel
        });

        return res.json({
            tank_name,
            water_level: numericLevel,
            alert: "LOW_WATER_LEVEL",
            threshold_crossed: true
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
