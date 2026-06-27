const { JWT_SECRET } = require("./config");
const { jwtVerify } = require("jose");
const mongoose = require("mongoose");

const jwtSecret = new TextEncoder().encode(JWT_SECRET);

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const bearerMatch = authHeader?.match(/^Bearer ([^\s]+)$/);

    if (!bearerMatch) {
        return res.status(401).json({
            error: {
                code: "AUTHENTICATION_REQUIRED",
                message: "A Bearer token is required"
            }
        });
    }

    const token = bearerMatch[1];

    try {
        const { payload } = await jwtVerify(token, jwtSecret, {
            issuer: "payment-app"
        });

        if (!mongoose.isValidObjectId(payload.userId)) {
            throw new Error("Invalid token subject");
        }

        req.userId = payload.userId;
        next();
    } catch (err) {
        return res.status(401).json({
            error: {
                code: "INVALID_TOKEN",
                message: "The token is invalid or expired"
            }
        });
    }
};

const asyncHandler = handler => (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
};

const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Route not found"
        }
    });
};

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err.name === "RequestValidationError") {
        return res.status(400).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Request validation failed",
                details: err.details
            }
        });
    }

    if (err.name === "AppError") {
        return res.status(err.status).json({
            error: {
                code: err.code,
                message: err.message,
                ...(err.details ? { details: err.details } : {})
            }
        });
    }

    if (err?.code === 11000) {
        return res.status(409).json({
            error: {
                code: "DUPLICATE_RESOURCE",
                message: "A resource with those details already exists"
            }
        });
    }

    if (err.name === "CastError" || err.name === "ValidationError") {
        return res.status(400).json({
            error: {
                code: "INVALID_DATA",
                message: "The supplied data is invalid"
            }
        });
    }

    if (
        err?.code === 20 ||
        /Transaction numbers are only allowed|replica set/i.test(err.message)
    ) {
        return res.status(503).json({
            error: {
                code: "TRANSACTIONS_UNAVAILABLE",
                message: "Money transfers are temporarily unavailable"
            }
        });
    }

    console.error(err);
    return res.status(500).json({
        error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred"
        }
    });
};

module.exports = {
    authMiddleware,
    asyncHandler,
    notFoundHandler,
    errorHandler
};
