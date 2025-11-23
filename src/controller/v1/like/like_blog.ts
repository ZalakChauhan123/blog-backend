// Custom modules
import { logger } from '@/lib/winston';


// Models
import Blog from '@/model/blog';
import User from '@/model/user';
import Like from '@/model/like';

// Types
import  type { Request, Response } from 'express';

/**
 * @function likeBlog
 * @description Increments the like count of a blog post by its ID.
 * @returns {Promise<void>} Responds with 404 if the blog is not found,
 *                          or 500 if a server error occurs.
 *                          Increments and saves the like count on success.
 * 
 * Logic 
 * 
 * Get blogId from params
 * Get userId from req.body
 * find blog based on blog Id with selection of likeCount
 * if not found , give 404 error
 * queries the db to check whether the current user has alreadz liked the given blog -- To prevent duplicate likes
 * Create new like entry for specific blog
 * Increment likeCount in blog db
 * save updated blog
 * response with 200 status code with blogCount
 *  
 * 
 **/

const likeBlog = async (req: Request, res:Response) => {

    try {

        const { blogId } = req.params;
        console.log('Blog Id - ', blogId );
        const userId = req.userId;
        console.log('user id- ', userId );

        const blog = await Blog.findById(blogId).select( 'likeCount' ).exec();
        console.log('Blog - ', blog);

        if(!blog) {
            res.status(404).json({
                code : 'NotFound',
                message : 'Blog not found',
            });
            return;
        };


        /**
        * Queries the database to check whether the current user
        * has already liked the given blog post to prevent duplicate likes.
        */
        const existingLike = await Like.findOne({ blogId, userId }).lean().exec();

        if(existingLike) {
            res.status(400).json({
                code : 'BadRequest',
                message : 'You already liked this blog'
            });
            return;
        };

        // Create a new like entry in Like db with userid and blogid
        await Like.create({ blogId, userId });
        // Increment likeCount in blog db
        blog.likeCount++;
        // Save blog document
        await blog.save();

        logger.info('Blog liked successfully', {
            userId,
            blogId: blog._id,
            likeCount: blog.likeCount
        });

        /**
        * Sends a 200 OK response indicating the blog was liked successfully.
        * Includes the updated number of likes in the response payload.
        **/
       res.status(200).json({
            likeCount : blog.likeCount
       });


    } catch (err) {

        res.status(500).json({
            code : 'ServerEror',
            message : 'Internal Server Erorr',
            error : err
        });

    };

};

export default likeBlog;

