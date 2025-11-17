import { query } from 'express-validator';

export const GetBlogValidation = [
    query('limit')
            .optional()
            .isInt({ min:1, max:50 })
            .withMessage('Limit must be between 1 to 50'),
            query('offset')
            .optional()
            .isInt({ min:0 })
            .withMessage('Page must be a positive interger')
]