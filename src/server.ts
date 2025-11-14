// Node Modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

// Custom Modules
import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/mongoose";
import { logger } from "@/lib/winston";

// Router
import v1Route from "@/routes/v1";

// Types
import type { CorsOptions } from 'cors';

// Intialise App
const app = express();

// Configure CORS Options
const CorsOptions:  CorsOptions = {
    origin (origin, callback) {
    
        if(
            config.NODE_ENV == 'development' ||
            !origin ||
            config.WHITELIST_ORIGINS.includes(origin)
        ){
          callback(null, true)  
        }
        else{
            // Reject all requests from non-whitelist origins
            callback(
                new Error (`CORS Error : ${origin} is not allowed by CORS`),
                false
            );
        }
    }

}

// Apply CORS middleware
app.use(cors(CorsOptions))

// Enable JSON body parsing
app.use(express.json());

// Enable URL encoded body parsing
// ´extended:true´ allows rich objects ans arrays via querystring library
app.use(express.urlencoded({ extended:true }));

app.use(cookieParser());

// Enable response compression to reduce payload size
app.use(compression({
    threshold: 1024, // Only Compress response larger than 1KB 
    })
);

// Enable Helmet for adding Extra Headers for security
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests & enhance security
app.use(limiter);



/*
 * Immediately Invoked Async Function Expression (IIFE) to start the server.
 *
 * - Tries to connect to the database before initializing the server.
 * - Defines the API route (`/api/v1`).
 * - Starts the server on the specified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process exits with status 1.
 */

(async () => {
  try {

   app.use("/api/v1", v1Route)

   await connectToDatabase();

   app.listen(4000, ()=>{
        logger.info(`Server is running on http://localhost:4000`);
    });

  } catch (err) {
    logger.warn('Failed to Start Server' , err);
    if (config.PORT === 'production') {
      process.exit(1);
    }
  }
})();


/**
 * Handles server shutdown gracefully by disconnecting from the database.
 *
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a success message if the disconnection is successful.
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code `0` (indicating a successful shutdown).
 */
const handleServerShoutdown = async() => {
    try {

        await disconnectFromDatabase();
        logger.error('SERVER SHOUTDOWN'),
        process.exit(0);

    } catch (err) {
        logger.error("Error during Server Shoutdown", err)
    }
}

/**
 * Listens for termination signals (`SIGTERM` and `SIGINT`).
 *
 * - `SIGTERM` is typically sent when stopping a process (e.g., `kill` command or container shutdown).
 * - `SIGINT` is triggered when the user interrupts the process (e.g., pressing `Ctrl + C`).
 * - When either signal is received, `handleServerShutdown` is executed to ensure proper cleanup.
 */
process.on('SIGTERM', handleServerShoutdown);
process.on('SIGINT', handleServerShoutdown);

