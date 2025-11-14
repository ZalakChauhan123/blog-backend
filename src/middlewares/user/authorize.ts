// Custom modules
import { logger } from '@/lib/winston';

// Models
import User from '@/model/user';

// Types
import type { Request, Response, NextFunction } from 'express';
export type AuthRole = 'admin' | 'user';

/**
 * Middleware to authorize a user based on their role.
 * @param roles The allowed roles for the user.
 * @returns A middleware function that checks if the user has the required role.
 * If the user does not have the required role, it returns a 403 Forbidden response.
 * If an error occurs while authorizing the user, it returns a 500 Internal Server Error response.
 */

const authorize = (roles: AuthRole[]) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        
        const userId = req.userId;

        try {

            // Check for user role (admin, user)
            const user = await User.findById(userId).select('role').exec();
            /* console.log('FROM AUTHORIZE Middleware - ',user) */

            // If user doesn't exists
            if (!user) {
                res.status(404).json({
                    code : 'Notfound',
                    message : 'User not found'
                });
                return;
            };

            // user role doesn't match with role defined in roles array, then gives error
            if(!roles.includes(user.role)) {
                res.status(403).json({
                    code : 'AuthorizationError',
                    message : 'Access denied, insufficient permissions',
                });
                return;
            };
            return next();

        } catch (err) {
            res.status(500).json({
                code : 'ServerError',
                message : 'Internal Server Error',
                error : err
            });

            logger.error('Error while authorizing user', err);
        };
    };
}

export default authorize