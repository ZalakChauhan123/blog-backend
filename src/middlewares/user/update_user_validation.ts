// Types
import { body } from 'express-validator';

// Model
import User from '@/model/user';

const UpdateUserValidation = [
    body('username')
    .optional()
    .trim()
    .isLength({ max:30 })
    .withMessage('Username must be less than 20 characters')
    .custom(async(value) => {
        const userExists = await User.exists({ username : value })

        if(userExists) {
            throw Error('This username already in use');
        };
    }),

    body('email')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async(value) => {
        const emailExists = await User.exists({ email: value })

        if(emailExists) {
            throw Error('This email already in use');
        }
    }),

    body('password')
    .optional()
    .isLength({ max: 20 })
    .withMessage('password must be less than 20 characters'),

    body('first_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),

    body('last_name')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),

     body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Invalid URL')
    .isLength({ max: 100 })
    .withMessage('Website URL must be less than 100 characters')
]

export default UpdateUserValidation;