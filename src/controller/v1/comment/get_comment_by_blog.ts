// Custom modules
import { logger } from '@/lib/winston';

// Models
import Blog from '@/model/blog';
import Comment from '@/model/comment';

// Type
import type { Request, Response } from 'express';


const getCommentsByBlog = async( req:Request, res:Response ): Promise<void> => {

    

    try {

        // Get slug by req.params
        const slug = req.params.slug;
        console.log('Slug - ', slug);

        // Check blog is exists by it's ID
        const blog = await Blog.findOne({ slug:slug }).select( '_id' ).exec();
        
        if(!blog){
            res.status(404).json({
                code : 'NotFound',
                message : 'Blog not found'
            });
        };

        // Find all comments where blog ID matches
        const getAllComments = await Comment.find({ blog: blog?._id })
            .populate( 'blog', 'banner.url title slug' )
            .populate( 'user', 'username firstName lastName' )
            .lean()
            .exec();

        res.status(201).json({
            comments : getAllComments
        });

        logger.info('Get all comments by slug successfully', { getAllComments, blog });

    } catch (err) {

        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err

        });

        logger.info('Error while get comments by blog', err);

    }

};

export default getCommentsByBlog;