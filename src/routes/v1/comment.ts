// Node modules
import { Router } from 'express';

// Middleware
import authenticate from '@/middlewares/auth/authenticate';
import authorize from '@/middlewares/user/authorize';
import validationErrors from '@/middlewares/auth/validationError';
import createBlogValidation from '@/middlewares/comment/commentBlogValidation';
import deleteCommentValidation from '@/middlewares/comment/deleteCommentValidation';

// Controller
import commentBlog from '@/controller/v1/comment/create_comment';
import getComment from  '@/controller/v1/comment/get_comment';
import getCommentsByBlog from '@/controller/v1/comment/get_comment_by_blog';
import deleteComment from '@/controller/v1/comment/delete_comment';

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

router.get(
    '/',
    authenticate,
    authorize(['admin', 'user']),
    getComment
);

router.get(
    '/blog/:slug',
    authenticate,
    authorize([ 'admin','user' ]),
    getCommentsByBlog

);

router.delete(
    '/:commentId',
    authenticate,
    authorize([ 'admin','user' ]),
    deleteCommentValidation,
    validationErrors,
    deleteComment
);

export default router;