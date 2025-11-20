// Node modules
import DOMpurify from 'dompurify';
import { JSDOM } from 'jsdom';

// custom module
import { logger } from '@/lib/winston';

// Model
import Blog from '@/model/blog';
import User from '@/model/user';

// Type
import type { Request, Response } from 'express';
import type { IBlog } from '@/model/blog';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

// Purify the blog content
const window = new JSDOM('').window;
const purify = DOMpurify(window);


const updateBlog = async(req:Request, res:Response): Promise<void> => {

    try{

        

        const { title, content, banner, status } = req.body as BlogData;
        console.log('REQ: BODY --- ',req.body);
        
        const userId = req.userId;
        const blogId = req.params.blogId;

        const user = await User.findById(userId).select('role').lean().exec();
        const blog = await Blog.findById(blogId).select('-__v').exec();

        if(!blog) {
            res.status(404).json({
                code : 'NotFound',
                message : 'Blog not found'
            });
            return;
        };

        if( blog.author !== userId && user?.role !== 'admin' ) {
            res.status(403).json({
                code : 'AuthenticationError',
                message : 'Access denied, insufficient permission'
            });

            logger.warn('User tries to update a blog content without permission', {
                userId,
                blog
            });
            return;
        };

        if(title) blog.title = title;
        if(content) {
            const cleanContent = purify.sanitize(content);
            blog.content = cleanContent;
        };
        if(banner) blog.banner = banner;
        if(status) blog.status = status;

        await blog.save();
        logger.info('User updated successfully', { blog });

        res.status(200).json({
            blog
        });


    } catch (err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });

        logger.error('Error during blog creation', err);
    }
};

export default updateBlog;
