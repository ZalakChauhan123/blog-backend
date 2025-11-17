import { query, param } from 'express-validator';

export const getBlogValidation = [

    query('limit')
        .optional()
        .isInt({ min:1, max:50 })
        .withMessage('Limit must be between 1 to 50'),

    query('offset')
        .optional()
        .isInt({ min:0 })
        .withMessage('Page must be a positive interger')
];


export const getBlogByUserValidation = [

    param('userId')
    .isMongoId()
    .withMessage('Invalid user Id'),

    query('limit')
        .optional()
        .isInt({ min:1, max:50 })
        .withMessage('Limit must be between 1 to 50'),

    query('offset')
        .optional()
        .isInt({ min:0 })
        .withMessage('Page must be a positive interger')

];