
// Types
import { cookie } from 'express-validator';

export const refreshTokenValidation = [
    cookie('refreshtoken')
    .isEmpty()
    .withMessage('Refresh token is required')
    .isJWT()
    .withMessage('Invalid refresh token')

]

