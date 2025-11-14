// Node modules
import { Router } from 'express';
import multer from 'multer';

// Middlewares or validations
import authenticate from '@/middlewares/auth/authenticate';
import authorize from'@/middlewares/user/authorize';
import validationError from '@/middlewares/auth/validationError';
import uploadBlogBanner from '@/middlewares/blog/uploadBannerImage';
import {CreateBlogValidation} from '@/middlewares/blog/blogCreateValidation';


// Controllers
// create
import createBlog from '@/controller/v1/blog/create_blog';

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


export default router;