const express = require("express");

const {
    validateEnv
} = require("./config/env");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");
const {
    metricsMiddleware,
    metricsHandler
} = require("./config/metrics");
const logger = require("./config/logger");

const app = express();

validateEnv();
app.use(express.json());
app.use(metricsMiddleware);

app.get("/", (req, res) => {
    res.json({
        service: "User Service",
        status: "Running"
    });
});

app.use("/health", healthRoutes);
app.use("/", healthRoutes);
app.use("/api/users", userRoutes);
app.get("/metrics", metricsHandler);

require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info("User Service started", {
        port: PORT
    });
});
