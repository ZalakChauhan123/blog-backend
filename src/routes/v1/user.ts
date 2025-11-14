// Node modules
import { Router } from 'express';

// Middlewares or validations
import authenticate  from '@/middlewares/auth/authenticate';  // for verify user's access token from the Authorization header.
import authorize  from '@/middlewares/user/authorize';  // authorize a user based on their role.
import validationError from '@/middlewares/auth/validationError';
import UserIdValidation from '@/middlewares/user/userId_validation';
import UpdateUserValidation from '@/middlewares/user/update_user_validation';
import queryValidation from '@/middlewares/user/get_all_users_query_validation';
 

// Controllers
// get
import getCurrentUser from '@/controller/v1/user/get_current_user';
import getUserbyId from '@/controller/v1/user/get_user';
import getAllUsers from '@/controller/v1/user/get_all_users';
// update
import updateCurrentUser from '@/controller/v1/user/update_current_user';
// delete
import deleteCurrentUser from '@/controller/v1/user/delete_current_user';
import deleteUserbyId from '@/controller/v1/user/delete_user';


// Routes
const router = Router();
// get
router.get('/current-user', authenticate, authorize(['admin','user']), getCurrentUser);
router.get('/:userId', authenticate, UserIdValidation, validationError, getUserbyId);
router.get('/',authenticate, authorize(['admin']), queryValidation,  getAllUsers);
// update
router.put('/current', authenticate, authorize(['admin', 'user']), UpdateUserValidation, validationError, updateCurrentUser);
// delete
router.delete('/current', authenticate, authorize(['admin', 'user']), deleteCurrentUser);
router.delete('/:userId', authenticate, UserIdValidation,  deleteUserbyId);

export default router;