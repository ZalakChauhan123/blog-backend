// Custom modules
import { logger } from '@/lib/winston';

// Model
import Blog from '@/model/blog';
import Like from '@/model/like';

// Types
import  type { Request, Response } from 'express';

/**
 * @function unlikeBlog
 * @description Handles unlike blog-post by decrementing its likes count.
 *              Expects `blogId` in the request parameters.
 * @returns {Promise<void>} Responds with a success message or appropriate error.
 */

const unlikeBlog = async (req:Request, res:Response) => {

    try {

        // Get userId from req
        const userId = req.userId;
        // Get blogId from req.params
        const {blogId} = req.params;
        console.log('user id & Blog id - ', { userId,  blogId});

        // Check like entry exits in the Like db
        const existingLike = await Like.findOne({ userId, blogId }).lean().exec();
        console.log('existingLike - ',existingLike)

        if(!existingLike) {
            res.status(400).json({
                code : 'BadRequest',
                message : 'Like not found'
            });
            return;
        };

        // Remove like entry from Like db
        // Logic : Remove document based on the _id of existing like
        await Like.deleteOne({ _id: existingLike._id });

        // Retrieve the blog based on blog id
        const existingBlog = await Blog.findById(blogId).select( 'likeCount' ).exec();

        if(!existingBlog){
            res.status(500).json({
                code : 'BadRequest',
                message : 'Like not found'
            });
            return;
        };

        // Decrese like counter in Blog db
        existingBlog.likeCount--;
        await existingBlog.save();

        logger.info('Blog dislike successfully', {
            userId,
            blogId : existingBlog._id,
            likeCounter : existingBlog.likeCount
        });

        res.status(200).json({
            likeCounter : existingBlog.likeCount
        });

    } catch(err) {

        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });

    };

};

export default unlikeBlog;