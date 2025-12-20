import fs from "fs";
import path from "path";
import winston from "winston";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.join(__dirname, "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, errors, json } = winston.format;

const logLine = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metaJson = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${ts} [${level}] ${message}${metaJson}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), errors({ stack: true })),
  transports: [
    new winston.transports.Console({ format: combine(logLine) }),
    new winston.transports.File({
      filename: path.join(logsDir, "app.log"),
      format: combine(json()),
    }),
  ],
});

export default logger;
