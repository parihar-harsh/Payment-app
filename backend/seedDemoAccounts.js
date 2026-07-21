const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { User, Account } = require("./db");
const {
    BCRYPT_ROUNDS,
    DEMO_ACCOUNT_PASSWORD,
    DEMO_SENDER_BALANCE,
    DEMO_RECEIVER_BALANCE
} = require("./config");

const DEMO_ACCOUNTS = [
    {
        username: "demo.sender@example.com",
        firstName: "Demo",
        lastName: "Sender",
        balance: DEMO_SENDER_BALANCE
    },
    {
        username: "demo.receiver@example.com",
        firstName: "Demo",
        lastName: "Receiver",
        balance: DEMO_RECEIVER_BALANCE
    }
];

async function ensureDemoAccount(input, passwordHash, session) {
    let user = await User.findOne({ username: input.username }).session(session);

    if (!user) {
        [user] = await User.create([{
            username: input.username,
            password: passwordHash,
            firstName: input.firstName,
            lastName: input.lastName
        }], { session });
    } else {
        user.firstName = input.firstName;
        user.lastName = input.lastName;
        user.password = passwordHash;
        await user.save({ session });
    }

    await Account.updateOne(
        { userId: user._id },
        {
            $setOnInsert: {
                userId: user._id,
                currency: "INR"
            },
            $set: {
                balance: input.balance
            }
        },
        { upsert: true, runValidators: true, session }
    );

    return user;
}

async function seedDemoAccounts() {
    const passwordHash = await bcrypt.hash(DEMO_ACCOUNT_PASSWORD, BCRYPT_ROUNDS);
    const session = await mongoose.startSession();
    const seededUsers = [];

    try {
        await session.withTransaction(async () => {
            for (const account of DEMO_ACCOUNTS) {
                const user = await ensureDemoAccount(account, passwordHash, session);
                seededUsers.push(user.username);
            }
        });
    } finally {
        await session.endSession();
    }

    console.log(`Demo accounts ready: ${seededUsers.join(", ")}`);
}

module.exports = {
    DEMO_ACCOUNTS,
    seedDemoAccounts
};
