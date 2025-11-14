// custom module
import { logger } from '@/lib/winston';
import config from '@/config';

// Model
import Blog from '@/model/blog';

// Type
import type { Request, Response } from 'express';


const createBlog = async(req:Request, res:Response): Promise<void> => {

    try{

    } catch (err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        })
    }
};

export default createBlog;
