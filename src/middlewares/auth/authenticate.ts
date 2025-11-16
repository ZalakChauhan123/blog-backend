// Node modules
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Custom modules
import { verifyAccessToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

// Types
import type { Request, Response, NextFunction } from 'express';
import type { Types } from 'mongoose';


/**
 * @function authenticate
 * @description Middleware to verify the user's access token from the Authorization header.
 *              If the token is valid, the user's ID is attached to the request object.
 *              Otherwise, it returns an appropriate error response.
 **/

const authenticate = (req:Request, res:Response, next:NextFunction) => {

    // Extract authentication Header
    const authHeader = req.headers.authorization;

    // If there is no Bearer token, responed with 401 error
    if(!authHeader?.startsWith('Bearer ')){
        res.status(401).json({
            code : 'Unauthorize Error',
            message : 'Access denied, no token provided'
        });
        return;
    }

    // Split out the token from the 'Bearer' Prefix
    // _ receives the first element ("Bearer") & token receives the second element (the actual JWT string)
    const [_, token] = authHeader.split(' ');

    try {

        // Verify the token and extract user id from the payload
        const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

        // Attach userId to the request for later use
        req.userId = jwtPayload.userId;

        // Proceed to next middleware or route handler
        return next();

    } catch (err) {

        // Handle expired token error
        if (err instanceof TokenExpiredError) {
            res.status(401).json({
                code : 'AuthenticationError',
                message : 'Access token expired, request a new one with refresh token'
            })
            return;
        }

        // Handle expired token error
        if (err instanceof JsonWebTokenError) {
            res.status(401).json({
                code : 'AuthenticationError',
                message : 'Access token invalid'
            })
            return;
        }

        // Catch all other errors
        res.status(500).json({
            code : 'ServerError',
            messagge : 'Internal Server Error',
            error : err
        });

        logger.error('Error during authentication' , err);
    }
}

export default authenticate;