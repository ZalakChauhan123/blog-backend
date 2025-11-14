
// Custom modules
import { logger } from '@/lib/winston';
import config from '@/config';
import { genUsername } from '@/utils'
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

// Models
import User from '@/model/user';
import Token from '@/model/token';

// Types
import type { Request, Response } from 'express';
import type { IUser } from '@/model/user';

// This creates a new type called UserData. 
// It uses TypeScript’s Pick utility type to select only the email, password, and role properties from the IUser type.
// So, UserData will have only those three properties.
type UserData = Pick<IUser, 'email' | 'password' | 'role' > 

const register = async (req:Request, res:Response): Promise<void> => {

    // It tells TypeScript to treat req.body as if it matches the UserData type.
    const { email, password, role } = req.body as UserData;

    // If the role is "admin" and the email is NOT in the whitelist, block registration
    if (role === 'admin' && !config.WHITELIST_ADMIN_MAIL.includes(email)) {
        res.status(403).json({
            code : 'AuthorizationError',
            message : 'You cannot register as an admin'
        });

        logger.warn(`User with mail ${email} try to register as an admin but is not in the whitelist`);
        return;
    }

    try{
        const username = genUsername();

        const newUser = await User.create({
            username,
            email, 
            password, 
            role
        });

        // Generate access token & refesh token for new user
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // Store refresh token in db
        await Token.create({ token: refreshToken, userId: newUser._id });
        logger.info('Token is generated successfully', {
            token : refreshToken,
            userId : newUser._id,
        })

        // Send refresh token to client
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite : 'strict'
        })

        // Get access token with new user
        res.status(201).json({
            user : {
                user: newUser.username,
                email: newUser.email,
                role: newUser.role
            },
            accessToken
        })

        logger.info('User Register Successfully', {
                user: newUser.username,
                email: newUser.email,
                role: newUser.role
        });

    } catch (err) {
        res.status(500).json({
            code: 'ServerError',
            message: 'Internal Server Error',
            error: err
        })

        logger.error('Error during user register', err);
    }
}

export default register;