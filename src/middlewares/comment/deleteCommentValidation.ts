import { param } from 'express-validator';

const deleteCommentValidation = [

    param('commentId')
        .notEmpty()
        .withMessage('Blog Id is required')
        .isMongoId()
        .withMessage('Invalid Blog Id'),

];

export default deleteCommentValidation;