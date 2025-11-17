// Custom modules
import config from '@/config';
import { logger } from '@/lib/winston';

// Modules
import Blog from '@/model/blog';
import User from '@/model/user';

// Types
import type { Request, Response } from 'express';

interface QueryType {
    status?: 'draft' | 'published'
};

const getAllBlogs = async(req: Request, res:Response) => {
    try{

        // Get users's objects id
        const userId = req.userId;
        // Set limit & offset for req.query
        const limit = parseInt(req.query.limit as string) || config.defaultResponseLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResponseOffset;
        // Find total blogs fron db
        const total = await Blog.countDocuments();

        // find role based on the object id in user db
        const user = await User.findById(userId).select('role').lean().exec();
        const query : QueryType = {};

        // Show only published post to normal users
        if(user?.role === 'user'){
            query.status = 'published';
        };

        
        const blogs = await Blog.find(query)
            .select('-banner.publicId -__v')
            .populate('author', '-createdAt -updatedAt -__v')
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        res.status(200).json({
            limit,
            offset,
            total,
            blogs
        });

        logger.info('Blogs fetching Successfull');


    } catch (err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });

        logger.error('Error while fetching Blogs', err);
    } 
};

export default getAllBlogs;