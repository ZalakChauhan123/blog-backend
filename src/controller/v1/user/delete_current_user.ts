// Custom modules
import { logger } from '@/lib/winston';

// Model
import User from '@/model/user';

// Types
import type { Request, Response } from 'express';

const deleteCurrentUser = async ( req:Request, res:Response ): Promise<void> => {

    const userId = req.userId;

    try{

        await User.deleteOne({ _id:userId });
        logger.info('User deleted successfully', userId);

        res.sendStatus(204);
        return;


    } catch (err) {
        res.status(500).json({
            code : 'ServerError',
            message : 'Internal Server Error',
            error : err
        });
    }

};

export default deleteCurrentUser;