// Node modules
import DOMpurify from 'dompurify';
import { JSDOM } from 'jsdom';

// custom module
import { logger } from '@/lib/winston';

// Model
import Blog from '@/model/blog';

// Type
import type { Request, Response } from 'express';
import type { IBlog } from '@/model/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

// Purify the blog content
const window = new JSDOM('').window;
const purify = DOMpurify(window);


const createBlog = async(req:Request, res:Response) => {

    try{

        const { title, content, banner, status } = req.body as BlogData;
        const userId = req.userId;

        const cleanContent = purify.sanitize(content);

        const newBlog = await Blog.create({
            title,
            content: cleanContent,
            banner,
            status,
            author : userId
        })

        res.status(201).json({
            blog : newBlog
        });

        logger.info('Blog created successfully', newBlog);

    } catch (err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });

        logger.error('Error during blog creation', err);
    }
};

export default createBlog;
