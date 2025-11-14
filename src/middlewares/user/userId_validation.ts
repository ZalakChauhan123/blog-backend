
// Node modules
import { param } from 'express-validator';

const UserValidation = [

    param('userId').notEmpty().isMongoId().withMessage('Invalid user ID')
];

export default UserValidation;