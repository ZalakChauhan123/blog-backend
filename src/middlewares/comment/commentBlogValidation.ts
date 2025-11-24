import { param, body } from 'express-validator';

const createBlogValidation = [

    param('blogId')
        .notEmpty()
        .withMessage('Blog Id is required')
        .isMongoId()
        .withMessage('Invalid Blog Id'),
    
    body('content')
        .notEmpty()
        .withMessage('Content is required')

];

export default createBlogValidation;

