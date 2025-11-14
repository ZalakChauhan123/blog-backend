import { Router } from 'express';

// Middlewares or validations
import authenticate from '@/middlewares/user/authorize';
import authorize from '@/middlewares/user/authorize';
import validationError from '@/middlewares/auth/validationError';


// Controllers
// create
import createBlog from '@/controller/v1/blog/create_blog';


// Routes
const router = Router();
// create
router.post('/', createBlog);


export default router;