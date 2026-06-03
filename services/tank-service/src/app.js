const express = require("express");
const {
    validateEnv
} = require("./config/env");
const tankRoutes = require("./routes/tankRoutes");
const healthRoutes = require("./routes/healthRoutes");
const {
    metricsMiddleware,
    metricsHandler
} = require("./config/metrics");
const logger = require("./config/logger");

const app = express();

require("dotenv").config();
validateEnv();

app.use(express.json());
app.use(metricsMiddleware);

app.put("/test", (req, res) => {
    res.json({
        message: "PUT route works"
    });
});

app.use("/api/tanks", tankRoutes);
app.get("/metrics", metricsHandler);
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
    res.json({
        service: "Tank Service",
        status: "Running"
    });
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    logger.info("Tank Service started", {
        port: PORT
    });
});
