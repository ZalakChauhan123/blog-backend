// Types
import { body } from 'express-validator';

// Models
import User from '@/model/user';

export const registerValidations =  [
    body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength( {max:50} )
    .withMessage('Email must be less than 50 Characters')
    .isEmail()
    .withMessage('Invalid Email address')
    .custom( async (value) => {
        const userExist = await User.exists( {email:value} );
        if(userExist) {
            throw new Error('User already exists')
        } 
    }),
    
    body('password')
    .notEmpty()
    .withMessage('Password should not be emapty')
    .isLength( {min:8} )
    .withMessage('Password must be less than 8 Characters'),

    body('role')
    .optional()
    .isString()
    .withMessage('Role must be a String')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user')
]