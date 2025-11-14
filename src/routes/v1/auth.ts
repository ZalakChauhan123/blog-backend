// Node Modules
import { Router } from "express";

// Validation Middlewares
import { registerValidations } from '@/middlewares/auth/registerValidation';
import { loginValidation } from '@/middlewares/auth/loginValidation';
import { refreshTokenValidation } from '@/middlewares/auth/refreshTokenValidation';
import authenticate from '@/middlewares/auth/authenticate';
import validationErrors from '@/middlewares/auth/validationError';

// Controllers
import register from '@/controller/v1/auth/register';
import login from '@/controller/v1/auth/login';
import refreshToken from '@/controller/v1/auth/refreshToken';
import logout from '@/controller/v1/auth/logout';


const router = Router();
router.post('/register', registerValidations, validationErrors, register);
router.post ('/login', loginValidation, validationErrors, login);
router.post('/refresh-token', refreshTokenValidation, refreshToken);
router.post('/log-out',authenticate, logout);

export default router;
