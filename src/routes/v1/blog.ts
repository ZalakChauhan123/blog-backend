// Node modules
import { Router } from 'express';
import multer from 'multer';
import { query } from 'express-validator';

// Middlewares or validations
import authenticate from '@/middlewares/auth/authenticate';
import authorize from'@/middlewares/user/authorize';
import validationError from '@/middlewares/auth/validationError';
import uploadBlogBanner from '@/middlewares/blog/uploadBannerImage';
import {CreateBlogValidation} from '@/middlewares/blog/blogCreateValidation';
import {GetBlogValidation} from '@/middlewares/blog/getBlogsValidation';


// Controllers
// create
import createBlog from '@/controller/v1/blog/create_blog';
import getAllBlogs from '@/controller/v1/blog/get_all_blogs';


// Multer upload
const upload = multer();

// Routes
const router = Router();
// create
router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.single('banner_image'),
    uploadBlogBanner('post'),
    CreateBlogValidation,
    validationError,
    createBlog);

    router.get(
        '/',
        authenticate,
        authorize(['admin','user']),
        GetBlogValidation,
        validationError,
        getAllBlogs
    )


export default router;