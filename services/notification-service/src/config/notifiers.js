const nodemailer = require("nodemailer");
const logger = require("./logger");

const isEmailEnabled = () =>
    process.env.EMAIL_ENABLED === "true" &&
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.ALERT_EMAIL_TO;

const sendEmailAlert = async (alert) => {
    if (!isEmailEnabled()) {
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.ALERT_EMAIL_FROM || process.env.SMTP_USER,
        to: process.env.ALERT_EMAIL_TO,
        subject: `Low water alert: ${alert.tank_name}`,
        text: `Tank ${alert.tank_name} is at ${alert.water_level}%.`
    });
};

const sendSlackAlert = async (alert) => {
    if (process.env.SLACK_ENABLED !== "true" || !process.env.SLACK_WEBHOOK_URL) {
        return;
    }

    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: `Smart Water Alert: ${alert.tank_name} is at ${alert.water_level}%.`
        })
    });

    if (!response.ok) {
        throw new Error(`Slack webhook failed with status ${response.status}`);
    }
};

const sendAlertNotifications = async (alert) => {
    try {
        await Promise.all([
            sendEmailAlert(alert),
            sendSlackAlert(alert)
        ]);
    } catch (error) {
        logger.warn("External alert notification failed", {
            error: error.message
        });
    }
};

module.exports = {
    sendAlertNotifications
};
