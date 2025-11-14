
// Node modules
import { validationResult } from 'express-validator';

// Types
import { Request, Response, NextFunction } from 'express';


// This middleware function checks if there are any validation errors in your request before proceeding with your route handler.
const validationErrors = (req: Request, res: Response, next: NextFunction) => {
    
    // Get validation results from the request
    const errors = validationResult(req);

    // If there are errors (errors is not empty)
    if (!errors.isEmpty()) {
        // Return a 400 Bad Request response with the errors
        return res.status(400).json({
            code: 'ValidationError',
            errors: errors.mapped()
        });
    }

    // If no errors, continue to the next middleware/route handler
    next();
};

export default validationErrors;