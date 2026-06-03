const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/live", (req, res) => {
    res.json({
        service: "Tank Service",
        status: "live"
    });
});

router.get("/ready", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({
            service: "Tank Service",
            status: "ready",
            database: "connected"
        });
    } catch (error) {
        res.status(503).json({
            service: "Tank Service",
            status: "not_ready",
            database: "unavailable"
        });
    }
});

module.exports = router;
