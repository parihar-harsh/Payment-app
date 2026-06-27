const crypto = require("crypto");
const express = require("express");
const bcrypt = require("bcryptjs");
const { SignJWT } = require("jose");
const mongoose = require("mongoose");
const { User, Account } = require("../db");
const {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    BCRYPT_ROUNDS,
    SIGNUP_BONUS
} = require("../config");
const { AppError } = require("../errors");
const { authMiddleware, asyncHandler } = require("../middleware");
const {
    signupBody,
    signinBody,
    updateBody,
    searchQuery,
    parse
} = require("../validation");

const router = express.Router();
const jwtSecret = new TextEncoder().encode(JWT_SECRET);

const createToken = userId => new SignJWT({ userId: userId.toString() })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer("payment-app")
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(jwtSecret);

const verifyPassword = async (suppliedPassword, storedPassword) => {
    if (storedPassword.startsWith("$2")) {
        return bcrypt.compare(suppliedPassword, storedPassword);
    }

    const supplied = Buffer.from(suppliedPassword);
    const stored = Buffer.from(storedPassword);
    return supplied.length === stored.length && crypto.timingSafeEqual(supplied, stored);
};

const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.post("/signup", asyncHandler(async (req, res) => {
    const input = parse(signupBody, req.body);
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const session = await mongoose.startSession();
    let user;

    try {
        await session.withTransaction(async () => {
            [user] = await User.create([{
                username: input.username,
                password: passwordHash,
                firstName: input.firstName,
                lastName: input.lastName
            }], { session });

            await Account.create([{
                userId: user._id,
                balance: SIGNUP_BONUS
            }], { session });
        });
    } finally {
        await session.endSession();
    }

    res.status(201).json({
        message: "User created successfully",
        token: await createToken(user._id),
        user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });
}));

router.post("/signin", asyncHandler(async (req, res) => {
    const input = parse(signinBody, req.body);
    const user = await User.findOne({ username: input.username }).select("+password");

    if (!user || !(await verifyPassword(input.password, user.password))) {
        throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    // Transparently migrate accounts created by the old plaintext-password backend.
    if (!user.password.startsWith("$2")) {
        user.password = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
        await user.save();
    }

    res.json({
        token: await createToken(user._id),
        user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });
}));

router.put("/", authMiddleware, asyncHandler(async (req, res) => {
    const input = parse(updateBody, req.body);
    const updates = { ...input };

    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, BCRYPT_ROUNDS);
    }

    const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: updates },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(404, "USER_NOT_FOUND", "User not found");
    }

    res.json({
        message: "Updated successfully",
        user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName
        }
    });
}));

router.get("/bulk", authMiddleware, asyncHandler(async (req, res) => {
    const { filter, page, limit } = parse(searchQuery, req.query);
    const escapedFilter = escapeRegex(filter);
    const match = {
        _id: { $ne: req.userId },
        ...(filter ? {
            $or: [
                { firstName: { $regex: escapedFilter, $options: "i" } },
                { lastName: { $regex: escapedFilter, $options: "i" } }
            ]
        } : {})
    };

    const [users, total] = await Promise.all([
        User.find(match)
            .select("firstName lastName")
            .sort({ firstName: 1, lastName: 1, _id: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        User.countDocuments(match)
    ]);

    res.json({
        user: users.map(user => ({
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        })),
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
}));

module.exports = router;
