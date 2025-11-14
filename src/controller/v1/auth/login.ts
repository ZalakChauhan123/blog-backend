
// Custom modules
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';

// Models
import User from '@/model/user';
import Token from '@/model/token';

// Types
import { Request, Response } from 'express';
import { IUser } from '@/model/user';

type UserData = Pick<IUser, 'email' | 'password'>; 

const login = async( req:Request, res:Response ): Promise<void> => {
    try{
            const { email } =  req.body as UserData;

            const user = await User.findOne({ email })
            .select('username password email role') // his tells MongoDB to only return the specified fields (username, password, email, role)
            .lean() // Mongoose return a plain JavaScript object instead of a Mongoose document.
            .exec(); // his executes the query and returns a Promise

            if(!user){
                res.status(404).json({
                    code : 'NotFound',
                    message : 'User not found'
                });
                return;
            }

            // Generate access token & refesh token for new user
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);
    
            // Store refresh token in db
            await Token.create({ token: refreshToken, userId: user._id });
            logger.info('Token is generated successfully', {
                token : refreshToken,
                userId : user._id,
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
                    user: user.username,
                    email: user.email,
                    role: user.role
                },
                accessToken
            })
    
            logger.info('User Login Successfully', user);
    
        } catch (err) {
            res.status(500).json({
                code: 'ServerError',
                message: 'Internal Server Error',
                error: err
            })
    
            logger.error('Error during user Login', err);
        }
}

export default login;