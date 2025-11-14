
// Node modules
import bcrypt from 'bcrypt';

// Types
import { body } from 'express-validator';

// Models
import User from '@/model/user';

export const loginValidation = [
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

            console.log('value of email in middleware - ', value);
            console.log('value of userExist in middleware - ', userExist);

            if(!userExist) {
                throw new Error('User Email or password is wrong')
            } 
        }),
        
        body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min:8 })
        .withMessage('Password must be at least 8 Characters')
        .custom( async (value, { req }) => {
            const { email } = req.body as { email: string };
            const user = await User.findOne({ email })
            .select('password')
            .lean()
            .exec();

        if(!user) {
            throw new Error('User Email or password is wrong');
        }

        const passwordMatch = await bcrypt.compare(value, user.password);

        if(!passwordMatch) {
            throw new Error('User email or password is wrong');
        }
        })
]

