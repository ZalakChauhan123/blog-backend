// node modules
import jwt from 'jsonwebtoken';

// Custom modules
import config from '@/config';

// Types
import { Types } from 'mongoose';


// Access token: short-lived
export const generateAccessToken = (userId: Types.ObjectId): string => {
    return jwt.sign( { userId }, config.JWT_ACCESS_SECRETE, {
        expiresIn : config.ACCESS_TOKEN_EXPIRY,
        subject : 'accessApi'
        }

    ) 
}

// Refresh token: long-lived
export const generateRefreshToken = (userId : Types.ObjectId): string => {
    return jwt.sign ( {userId} , config.JWT_REFRESH_SECRETE, {
        expiresIn : config.REFRESH_TOKEN_EXPIRY,
        subject : 'refreshToken'
        }

    )
}

// Verify access token
export const verifyAccessToken = (token: string): jwt.JwtPayload | string => {
    return jwt.verify(token, config.JWT_ACCESS_SECRETE);
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload | string => {
    return jwt.verify(token, config.JWT_REFRESH_SECRETE);
};