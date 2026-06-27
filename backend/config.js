const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env"), quiet: true });

const parsePositiveInteger = (value, fallback, name) => {
    const parsed = Number(value ?? fallback);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${name} must be a positive integer`);
    }
    return parsed;
};

const parseNonNegativeInteger = (value, fallback, name) => {
    const parsed = Number(value ?? fallback);
    if (!Number.isInteger(parsed) || parsed < 0) {
        throw new Error(`${name} must be a non-negative integer`);
    }
    return parsed;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to a value of at least 32 characters");
}

module.exports = {
    NODE_ENV: process.env.NODE_ENV || "development",
    HOST: process.env.HOST || "0.0.0.0",
    PORT: parsePositiveInteger(process.env.PORT, 3000, "PORT"),
    MONGODB_URI:
        process.env.MONGODB_URI ||
        "mongodb://127.0.0.1:27017/paytm?replicaSet=rs0",
    JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
    BCRYPT_ROUNDS: parsePositiveInteger(
        process.env.BCRYPT_ROUNDS,
        12,
        "BCRYPT_ROUNDS"
    ),
    SIGNUP_BONUS: parseNonNegativeInteger(
        process.env.SIGNUP_BONUS,
        0,
        "SIGNUP_BONUS"
    ),
    CORS_ORIGINS: (process.env.CORS_ORIGINS || "http://localhost:5173")
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean),
    REQUIRE_TRANSACTIONS: process.env.REQUIRE_TRANSACTIONS !== "false",
    TRUST_PROXY: process.env.TRUST_PROXY === "true"
};
