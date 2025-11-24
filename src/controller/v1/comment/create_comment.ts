// Node modules
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom'; 


// Custom modules
import { logger } from '@/lib/winston';

// Models
import Blog from '@/model/blog';
import Comment from '@/model/comment';

// Types
import type { Request, Response } from 'express';
import type { Types } from 'mongoose';
import type { IComment } from '@/model/comment';

type CommentData = Pick<IComment, 'content'>;

/* type RequestBody = {
    content : string
};

type RequestParams = {
    blogId : string
}; */

// Purify Comment data
const window = new JSDOM('').window;
const purify = DOMPurify(window);

/**--------------------------------------------------------------------
 * @function createComment
 * @description Handles the creation of a comment on a blog post.
 *              Expects `blogId` and `content` in the request body, and `userId` from the authenticated request.
 --------------------------------------------------------------------**/

const commentBlog = async( req:Request, res:Response ): Promise<void> => {

    const userId = req.userId;
    const { blogId } = req.params;
    const { content } = req.body as CommentData;

    console.log('UserId , BlogID , Content', {
        userId, blogId, content
    })

    try {

        // Check if Blog is exists or not with the selection of id & commentCount
        const blog = await Blog.findById( blogId ).select( '_id commentCount' ).exec();

        console.log('Blog - ', {blog})

        if(!blog) {
            res.status(400).json({
                code : 'NotFound',
                message : 'Blog not found'
            })
            return;
        };

        const cleanContent = purify.sanitize(content);
        console.log('cleanContent - ', {cleanContent})

        // Create comment
        const newComment = await Comment.create({
            blog: blogId,
            content : cleanContent,
            user: userId
        });

        console.log('newComment - ', {newComment})

        // Increment blog count in blog db
        blog.commentCount++;
        // Save blog document
        await blog.save();


        logger.info('Blog comment counter updated', {
            blogId : blog._id,
            commentCounter : blog.commentCount
        });

        res.status(201).json({
            comment : newComment
        });

    } catch (err) {

        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });

        logger.info('Error while commenting the blog', err);

    };

};

export default commentBlog;




