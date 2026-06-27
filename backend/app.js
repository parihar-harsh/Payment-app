const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");
const mongoose = require("mongoose");
const rootRouter = require("./routes");
const { CORS_ORIGINS, TRUST_PROXY } = require("./config");
const { notFoundHandler, errorHandler } = require("./middleware");
const { AppError } = require("./errors");

const app = express();

app.disable("x-powered-by");
if (TRUST_PROXY) {
    app.set("trust proxy", 1);
}
app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        if (!origin || CORS_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new AppError(403, "CORS_DENIED", "Origin is not allowed"));
    },
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400
}));
app.use(express.json({ limit: "16kb" }));

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: {
            code: "RATE_LIMITED",
            message: "Too many authentication attempts; try again later"
        }
    }
});

app.get("/health", (req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
        status: databaseReady ? "ok" : "unavailable",
        database: databaseReady ? "connected" : "disconnected"
    });
});

app.use("/api/v1", apiLimiter);
app.use("/api/v1/user/signup", authLimiter);
app.use("/api/v1/user/signin", authLimiter);
app.use("/api/v1", rootRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
