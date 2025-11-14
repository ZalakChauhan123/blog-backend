// Custom Modules
import { logger } from '@/lib/winston';

// Models
import User from '@/model/user';

// Types
import type { Request, Response } from 'express';


const getUserbyId = async (req:Request, res:Response): Promise<void> => {

    try {

        // Get user id on req.params
        const userId = req.params.userId;

        // Check in the db based on userid
        const user = await User.findById(userId).select('-__v').exec();

        if(!user) {
            res.status(404).json({
                code : 'NotFound',
                message : 'User not found'
            })
        };
        res.status(200).json({
            user
    });

    } catch (err) {

        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        })
    }
};

export default getUserbyId;

