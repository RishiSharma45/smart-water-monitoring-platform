const express = require("express");

const router = express.Router();

const {
    createTank,
    getTanks,
    updateTankLevel
} = require("../controllers/tankController");

router.post("/", createTank);

router.get("/", getTanks);

router.put("/:id", updateTankLevel);

module.exports = router;