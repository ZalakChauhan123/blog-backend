// Custom modules
import { logger } from '@/lib/winston';
import config from '@/config';

// Model
import User from '@/model/user';

// type
import type { Request, Response } from 'express';

const getAllUsers = async (req:Request, res:Response): Promise<void> => {
    try {

        // Parse offset, Limit in request
        const offset = parseInt(req.query.offset as string) ?? config.defaultResponseOffset; // number of items to skip from the beginning of the result set
        const limit = parseInt(req.query.limit as string) ?? config.defaultResponseLimit;  //  maximum number of items to be returned in a single page
        // NOTE : ?? = nullish coalescing operator (provide a default value for a variable if the variable is null or undefined)

        // Get total document count
        const total = await User.countDocuments();

        // Featch users
        const users = await User.find()
        .select('-__v')
        .skip(offset)
        .limit(limit)
        .lean()
        .exec();

        res.status(200).json({
            offset : offset,
            limit : limit,
            total : total,
            users
        })

    } catch (err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal server error',
            error : err
        });
    };
};

export default getAllUsers;
