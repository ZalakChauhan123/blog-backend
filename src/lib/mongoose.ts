// Node Modules
import mongoose from "mongoose";

// Custome Modules
import config from '@/config';
import { logger } from "@/lib/winston";

// Types
import type { ConnectOptions } from "mongoose";

// Client Options
const clientOptions : ConnectOptions = {
    dbName : 'blog-db',
    appName : 'Blog API',
    serverApi : {
        version : '1',
        strict : true,
        deprecationErrors : true
    }
}


// Connect with Database
export const connectToDatabase = async (): Promise<void> => {

    if(!config.MONGO_URI){
        throw new Error('MongoDB URI is not defined in the configuration')
    }
    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info('Database Connected Succesfully', {
            uri : config.MONGO_URI,
            options : clientOptions
        })
    } catch (err) {
        if (err instanceof Error){
            throw err;
        }
        logger.error('Error Connecting to Database' , err);
    }
}


// Disconnect from Database
export const disconnectFromDatabase = async (): Promise <void> => {

    try {
        await mongoose.disconnect();
        logger.info('Database Disconnect Successfully', {
            uri : config.MONGO_URI,
            option : clientOptions
        })
    } catch (err) {
        if (err instanceof Error){
            throw new Error(err.message);
        }
        logger.error('Error while Disconnect to Database' , err);

    }
}