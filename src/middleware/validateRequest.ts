import { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Request validation failed.",
            errors: error.details.map((detail) => detail.message),
        });
    }

    // Assign validated body to req object
    req.body = value;

    // Continue with the next middleware or route handler
    next();
};
