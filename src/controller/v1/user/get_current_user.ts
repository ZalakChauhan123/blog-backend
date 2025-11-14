// Custom modules
import { logger } from '@/lib/winston';
import config from '@/config';

// Models
import User from '@/model/user';

// Types
import type { Request, Response } from 'express';

const getCurrentUser = async(req:Request, res:Response): Promise<void> => {
    try {

        const userId = req.userId;

        const getCurrentUser = await User.findById(userId).select('-__v').exec();

        res.status(200).json({
            getCurrentUser
        });

    } catch(err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });

        logger.error('Error while getting current user', err);
    }
}

export default getCurrentUser;