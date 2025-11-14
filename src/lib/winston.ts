// Node modules
import winston from "winston";

// Custom modules
import config from "@/config";

const { combine, colorize, timestamp, json, printf, errors, align } = winston.format;

// Define the transports array to hold different logging transports
const transports : winston.transport[] = [];


// This piece of code creates log message format for logger
// If the application is not running in production, add a console transport
if (config.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({

            format : combine(
                colorize({ all:true }), // Add colors to log levels
                timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }), // Add timestamp to logs
                align(), // Align log messages
                // creates the log message format
                printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';
                    return `${timestamp} [${level}]: ${message}${metaStr}`;
                })
            )
        })
    )
}


// Create a Logger instance using Winston
const logger = winston.createLogger({

    level : config.LOG_LEVEL || 'info',  // Set default logging level to 'info'
    format : combine(timestamp(), errors({ stack: true }), json()), // Use JSON format for logging
    transports,
    silent: config.NODE_ENV == 'test', // Disable logging in test environment

});

export { logger };