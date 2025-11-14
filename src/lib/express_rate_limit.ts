import { rateLimit } from "express-rate-limit"

const limiter = rateLimit ({
    windowMs: 6000,  // 1 minute time window to prevent abuse
    limit: 60,  // Allow maximum 60 requests per window IP
    standardHeaders:'draft-8',  // Use latest rate-limit headers
    legacyHeaders: false, // Disable deprecated X-Ratelimit Headers
    message: {
        error:
            'You have sent too many request in a given amount of time. Please try again later'
    }

})

export default limiter;