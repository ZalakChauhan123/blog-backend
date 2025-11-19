// Node modules
import { Router } from 'express';
import multer from 'multer';

// Middlewares or validations
import authenticate from '@/middlewares/auth/authenticate';
import authorize from'@/middlewares/user/authorize';
import validationError from '@/middlewares/auth/validationError';
import uploadBlogBanner from '@/middlewares/blog/uploadBannerImage';
import {createBlogValidation} from '@/middlewares/blog/blogCreateValidation';
import {getBlogValidation, getBlogByUserValidation, getBlogBySlugValidation} from '@/middlewares/blog/getBlogsValidation';


// Controllers
// create
import createBlog from '@/controller/v1/blog/create_blog';
// get
import getAllBlogs from '@/controller/v1/blog/get_all_blogs';
import getBlogByUser from '@/controller/v1/blog/get_blog_by_user';
import getBlogBySlug from '@/controller/v1/blog/get_blogs_by_slug';


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
    createBlogValidation,
    validationError,
    createBlog
);

router.get(
    '/',
    authenticate,
    authorize(['admin','user']),
    getBlogValidation,
    validationError,
    getAllBlogs
);

router.get(
    '/user/:userId',
    authenticate,
    authorize(['admin','user']),
    getBlogByUserValidation,
    validationError,
    getBlogByUser
);

router.get(
    "/:slug",
    authenticate,
    authorize(['admin','user']),
    getBlogBySlugValidation,
    validationError,
    getBlogBySlug);

export default router;