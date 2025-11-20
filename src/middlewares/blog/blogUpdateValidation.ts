// Node modules
import { param, body } from 'express-validator';

export const updateBlogValidation = [

    param('blogId')
    .isMongoId()
    .withMessage('Invalid blog Id'),

    body('title')
    .optional()
    .isLength({ max:180 })
    .withMessage('Title must be less than 180 characters'),

    body('content'),

    body('status')
    .optional()
    .isIn( ['draft','published'] )
    .withMessage('Status must be one of the value from draft or published'),

];