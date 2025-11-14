// Import Module
import dotenv from 'dotenv';

// Types
import type ms from 'ms';

dotenv.config();

const config = {
    PORT : process.env.PORT || 4000,
    NODE_ENV : process.env.NODE_ENV,

    WHITELIST_ORIGINS : [
        'https://blog.codewithsadee.com',
    ],

    WHITELIST_ADMIN_MAIL : [
        'adminexample@gmail.com',
        'ownerexample@gmail.com'
    ],

    MONGO_URI : process.env.MONGO_URI,
    LOG_LEVEL : process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_SECRETE : process.env.JWT_ACCESS_SECRETE!,
    JWT_REFRESH_SECRETE : process.env.JWT_REFRESH_SECRETE!,
    ACCESS_TOKEN_EXPIRY : process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
    REFRESH_TOKEN_EXPIRY : process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue,
    defaultResponseLimit : 20,
    defaultResponseOffset : 0,


} 

export default config;


