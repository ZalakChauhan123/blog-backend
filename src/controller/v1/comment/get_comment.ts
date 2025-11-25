// Custom Modules
import { logger } from '@/lib/winston';
import config from '@/config';


// Models
import Comment from '@/model/comment';


// Types
import type { Request, Response } from 'express';

type RequestQuery = {
    offset : string,
    limit : string
};

const getComment = async( req:Request, res:Response ): Promise <void> => {


    const { offset = config.defaultResponseOffset,
                limit = config.defaultResponseLimit
         } = req.body as RequestQuery;

    try {

        const getComments = await Comment.find()
            .populate('blog', 'banner.url tile slug')
            .populate('user', 'username email firstName lastName')
            .limit(Number(limit))
            .skip(Number(offset))
            .lean()
            .exec();
        
        const total = await Comment.countDocuments();

        res.status(200).json({
            offset : Number(offset),
            limit : Number(limit),
            total : total,
            comments : getComments
        });

        logger.info('Comments fetched successfully');

    } catch (err) {

        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err

        });

        logger.info('Error while get comments', err);

    }

}

export default getComment;
