const client = require("prom-client");

const serviceName = "user-service";

client.collectDefaultMetrics({
    prefix: "smart_water_",
    labels: {
        service: serviceName
    }
});

const httpRequestsTotal = new client.Counter({
    name: "smart_water_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["service", "method", "route", "status_code"]
});

const httpRequestDurationSeconds = new client.Histogram({
    name: "smart_water_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["service", "method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

const httpErrorsTotal = new client.Counter({
    name: "smart_water_http_errors_total",
    help: "Total number of HTTP error responses",
    labelNames: ["service", "method", "route", "status_code"]
});

const userRegistrationsTotal = new client.Counter({
    name: "smart_water_user_registrations_total",
    help: "Total number of successful user registrations",
    labelNames: ["service"]
});

const serviceHealthGauge = new client.Gauge({
    name: "smart_water_service_health",
    help: "Service health status where 1 is healthy and 0 is unhealthy",
    labelNames: ["service"]
});

userRegistrationsTotal.inc({
    service: serviceName
}, 0);
serviceHealthGauge.set({
    service: serviceName
}, 1);

const getRouteLabel = (req) => req.route?.path || req.baseUrl || req.path;

const metricsMiddleware = (req, res, next) => {
    if (req.path === "/metrics") {
        return next();
    }

    const endTimer = httpRequestDurationSeconds.startTimer();

    res.on("finish", () => {
        const labels = {
            service: serviceName,
            method: req.method,
            route: getRouteLabel(req),
            status_code: String(res.statusCode)
        };

        httpRequestsTotal.inc(labels);
        endTimer(labels);

        if (res.statusCode >= 400) {
            httpErrorsTotal.inc(labels);
        }
    });

    next();
};

const metricsHandler = async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
};

module.exports = {
    metricsMiddleware,
    metricsHandler,
    userRegistrationsTotal,
    serviceHealthGauge
};
