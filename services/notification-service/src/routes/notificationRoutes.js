const express = require("express");

const router = express.Router();

const {
    checkWaterLevel
} = require("../controllers/notificationController");

router.post("/check", checkWaterLevel);

module.exports = router;