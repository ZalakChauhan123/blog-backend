import { query } from 'express-validator';

const queryValidation = [

    query('limit')
    .optional()
    .isInt({ min:1, max:50 })
    .withMessage('Limit must be between 1 to 50'),

    query('offset')
    .optional()
    .isInt({  min:0 })
    .withMessage('Offset value shozld be positive Integer')


]

export default queryValidation;