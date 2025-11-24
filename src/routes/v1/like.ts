// Node modules
import { Router } from 'express';

// Middleware
import authenticate from '@/middlewares/auth/authenticate';
import authorize from'@/middlewares/user/authorize';

// Controllers
import likeBlog from '@/controller/v1/like/like_blog';
import unlikeBlog from '@/controller/v1/like/dislike_blog';

// Router intial
const router = Router();

router.post(
    '/blog/:blogId',
    authenticate,
    authorize(['admin','user']),
    likeBlog
);

router.delete(
    '/blog/:blogId',
    authenticate,
    authorize(['admin','user']),
    unlikeBlog
);


export default router;