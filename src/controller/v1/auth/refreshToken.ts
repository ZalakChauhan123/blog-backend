// Node modules
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// Custom modules

import { logger } from '@/lib/winston';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from '@/lib/jwt';

// Types
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

// Models
import Token from '@/model/token';


const refreshToken = async(req:Request, res:Response) => {

    // Get refresh token from cookies
    const refreshToken = req.cookies.refreshToken as string;

    try {
        // check if refresh token (long lived) exists in db
        const tokenExists = await Token.exists({ token:refreshToken });
        if(!tokenExists) {
            res.status(401).json({
                code: 'AuthenticationError',
                message: 'Invalid Refresh Token'
            });
            return; // to stop executing the rest of the function
        };

        // Extract User 's object ID 
        const jwtPayload = verifyRefreshToken(refreshToken) as {
            userId: Types.ObjectId
        };

        // Generate new access token (short lived)
        const accessToken = generateAccessToken(jwtPayload.userId);

        // Send access token to client
        res.status(200).json({
            accessToken
        });
    } 
    
    catch (err) {

        if (err instanceof TokenExpiredError) {
            res.status(401).json({
                code : 'Unauthorization Error',
                message : 'Refresh token expired. Please login again!'
            })
            return;
        }

        if (err instanceof JsonWebTokenError) {
            res.status(401).json({
                code : 'Unauthentication Error',
                message : 'Invalidate refresh token'
            })
            return;
        }
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });
    };


};

export default refreshToken;