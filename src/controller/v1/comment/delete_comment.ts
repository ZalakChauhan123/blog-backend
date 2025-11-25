// Custom Modules
import { logger } from '@/lib/winston';

// Models
import Comment from '@/model/comment';
import User from '@/model/user';
import Blog from '@/model/blog';

// Types
import type { Request, Response } from 'express';



const deleteComment = async (req:Request, res:Response):Promise<void> => {

    const currentUserId = req.userId;
    const commentId = req.params.commentId;

    try {

        const comment = await Comment.findById( commentId ).select( 'user blog' ).exec();

        if(!comment) {
            res.status(404).json({
                code : 'NotFound',
                message : 'Comment not found'
            });
            return;
        };

        const user = await User.findById( currentUserId ).select( 'role' ).exec();

        /* 
        deletion allow ONLY in two cases:
        -- The user who created the comment can delete it
        -- An admin can delete any comment 
        */
        if( !(comment.user.equals(currentUserId)) && user?.role !== 'admin' ) {
            res.status(403).json({
                code : 'UnauthorizationError',
                message : 'Access denied insufficient permission'
            });

            logger.warn('User tries to delete comment without permission', {
                userId : currentUserId,
                comment
            });
            return;
        };

        await Comment.deleteOne( comment._id ).exec();
        logger.info('Delete Comment Successfully', {commentId});

        // For decrement of comment count in blog DB
        // Find blog Id with selection of comment count
        const blog = await Blog.findById(comment.blog).select( 'commentCount' ).exec();
        
        if(!blog) {
            res.status(404).json({
                code : 'NotFound',
                message : 'Blog not found'
            });
            return;
        };

        blog.commentCount--;
        await blog.save();

        logger.info('Blog comment count updated', {
            blogId : comment.blog,
            commentCounter : blog.commentCount
        });

        res.sendStatus(204);
        return;
        

    } catch (err) {

        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err

        });

        logger.info('Error while delete comment', err);

    }

};

export default deleteComment;