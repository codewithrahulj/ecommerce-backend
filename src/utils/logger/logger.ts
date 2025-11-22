import { CONFIG } from "#config.js";
import pino from "pino";

export default pino({
  level: process.env.PINO_LOG_LEVEL ?? "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: CONFIG.IS_DEVELOPMENT
    ? {
        options: {
          colorize: true,
          ignore: "pid,hostname", // Example: ignore specific fields
          translateTime: "yyyy-mm-dd HH:MM:ss", // Example: custom time format
        },
        target: "pino-pretty",
      }
    : undefined, // Disable transport in production/other environments
});
