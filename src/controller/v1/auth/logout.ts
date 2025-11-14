// Custom modules
import { logger } from '@/lib/winston';

// Model
import Token from '@/model/token';

// Types
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import config from '@/config';

const logout = async(req: Request, res:Response): Promise<void> => {

    try {

        // Get refreshtoken from request cookies
        const refreshToken = req.cookies.refreshToken;

        // if refresh token available delete it from db
        if(refreshToken){
            await Token.deleteOne({ token:refreshToken })

            logger.info('Refresh token deleted successfully', {
                userId : req.userId,
                token: refreshToken
            });
        };

        // Clear cookies
        res.clearCookie('refreshToken', { 
            httpOnly : true,
            secure : config.NODE_ENV === 'production',
            sameSite : 'strict'
        });

        res.sendStatus(204);

        logger.info('User logged out successfully', {
            userId: req.userId,
        });


    } catch(err) {
        res.status(500).json({
            code : 'serverError',
            message : 'Internal server error',
            error : err
        });
        logger.error('Error during user logged out', err);
    };
};

export default logout;