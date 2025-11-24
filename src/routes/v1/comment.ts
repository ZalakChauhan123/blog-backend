// Node modules
import { Router } from 'express';

// Middleware
import authenticate from '@/middlewares/auth/authenticate';
import authorize from '@/middlewares/user/authorize';
import validationErrors from '@/middlewares/auth/validationError';
import createBlogValidation from '@/middlewares/comment/commentBlogValidation';

// Controller
import commentBlog from '@/controller/v1/comment/create_comment';

// Route intial
const router = Router();


// All comments routes
router.post(
    '/blogs/:blogId',
    authenticate,
    authorize([ 'admin','user' ]),
    createBlogValidation,
    validationErrors,
    commentBlog
);

export default router;