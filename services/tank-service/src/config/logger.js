const log = (level, message, details = {}) => {
    console.log(JSON.stringify({
        level,
        service: "tank-service",
        message,
        timestamp: new Date().toISOString(),
        ...details
    }));
};

module.exports = {
    info: (message, details) => log("info", message, details),
    error: (message, details) => log("error", message, details),
    warn: (message, details) => log("warn", message, details)
};
