const express = require("express");
const alertRoutes = require("./routes/alertRoutes");
const healthRoutes = require("./routes/healthRoutes");
const {
    validateEnv
} = require("./config/env");
const {
    metricsMiddleware,
    metricsHandler
} = require("./config/metrics");
const logger = require("./config/logger");

require("dotenv").config();

const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

validateEnv();
app.use(express.json());
app.use(metricsMiddleware);


app.get("/", (req, res) => {
    res.json({
        service: "Notification Service",
        status: "Running"
    });
});

app.use("/api/notifications", notificationRoutes);
app.use("/api/alerts", alertRoutes);
app.get("/metrics", metricsHandler);
app.use("/health", healthRoutes);
app.use("/", healthRoutes);
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    logger.info("Notification Service started", {
        port: PORT
    });
});
