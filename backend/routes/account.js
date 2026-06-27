const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware, asyncHandler } = require("../middleware");
const { Account, Transfer } = require("../db");
const { AppError } = require("../errors");
const {
    transferBody,
    paginationQuery,
    parse
} = require("../validation");

const router = express.Router();

router.use(authMiddleware);

router.get("/balance", asyncHandler(async (req, res) => {
    const account = await Account.findOne({ userId: req.userId }).lean();

    if (!account) {
        throw new AppError(404, "ACCOUNT_NOT_FOUND", "Account not found");
    }

    res.json({
        balance: account.balance,
        currency: account.currency
    });
}));

router.get("/transactions", asyncHandler(async (req, res) => {
    const { page, limit } = parse(paginationQuery, req.query);
    const match = {
        $or: [
            { fromUserId: req.userId },
            { toUserId: req.userId }
        ]
    };

    const [transactions, total] = await Promise.all([
        Transfer.find(match)
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Transfer.countDocuments(match)
    ]);

    res.json({
        transactions: transactions.map(transaction => ({
            id: transaction._id,
            type: transaction.fromUserId.toString() === req.userId ? "debit" : "credit",
            otherUserId: transaction.fromUserId.toString() === req.userId
                ? transaction.toUserId
                : transaction.fromUserId,
            amount: transaction.amount,
            currency: transaction.currency,
            createdAt: transaction.createdAt
        })),
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
}));

router.post("/transfer", asyncHandler(async (req, res) => {
    const { amount, to } = parse(transferBody, req.body);

    if (to === req.userId) {
        throw new AppError(400, "SELF_TRANSFER", "Cannot transfer money to yourself");
    }

    const session = await mongoose.startSession();
    let transfer;

    try {
        await session.withTransaction(async () => {
            const recipient = await Account.exists({ userId: to }).session(session);

            if (!recipient) {
                throw new AppError(404, "RECIPIENT_NOT_FOUND", "Recipient account not found");
            }

            const debit = await Account.updateOne(
                {
                    userId: req.userId,
                    balance: { $gte: amount }
                },
                { $inc: { balance: -amount } },
                { session, runValidators: true }
            );

            if (debit.modifiedCount !== 1) {
                const senderExists = await Account.exists({
                    userId: req.userId
                }).session(session);

                if (!senderExists) {
                    throw new AppError(404, "ACCOUNT_NOT_FOUND", "Sender account not found");
                }

                throw new AppError(400, "INSUFFICIENT_BALANCE", "Insufficient balance");
            }

            const credit = await Account.updateOne(
                { userId: to },
                { $inc: { balance: amount } },
                { session, runValidators: true }
            );

            if (credit.modifiedCount !== 1) {
                throw new AppError(409, "TRANSFER_CONFLICT", "The transfer could not be completed");
            }

            [transfer] = await Transfer.create([{
                fromUserId: req.userId,
                toUserId: to,
                amount
            }], { session });
        });
    } finally {
        await session.endSession();
    }

    res.status(201).json({
        message: "Transfer successful",
        transfer: {
            id: transfer._id,
            amount: transfer.amount,
            currency: transfer.currency,
            to: transfer.toUserId,
            createdAt: transfer.createdAt
        }
    });
}));

module.exports = router;
