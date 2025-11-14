// Custom modules
import { logger } from '@/lib/winston';

// Model
import User from '@/model/user';

// Types
import type { Request, Response } from 'express';

const updateCurrentUser = async( req:Request, res:Response ): Promise<void> => {
    
    const userId = req.userId;
    const {
        username,
        email,
        password,
        role,
        first_name,
        last_name,
        website,
        facebook,
        instagram,
        linkedin,
        x,
        youtube
    } = req.body;

    try {
        const user = await User.findById(userId).select('+password __-v').exec();

        if (!user) {
            res.status(404).json({
                code : 'NotFound',
                message : 'User not found'
            });
            return;
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (role) user.role = role;
        if (first_name) user.firstname = first_name;
        if (last_name) user.lastname = last_name;
        if (!user.socialurls) {
            user.socialurls = {};
        };
        if (website) user.socialurls.website = website;
        if (facebook) user.socialurls.facebook = facebook;
        if (instagram) user.socialurls.website = instagram;
        if (linkedin) user.socialurls.linkedin = linkedin;
        if (x) user.socialurls.x = x;
        if (youtube) user.socialurls.youtube = youtube;

        await user.save();
        logger.info('User update successfully', user);

        res.status(201).json({
            user
        });

    } catch (err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });
    };
};

export default updateCurrentUser;