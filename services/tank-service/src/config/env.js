require("dotenv").config();

const requiredEnv = [
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "DB_HOST",
    "DB_PORT",
    "NOTIFICATION_SERVICE_URL"
];

const validateEnv = () => {
    const missing = requiredEnv.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
};

module.exports = {
    validateEnv
};
