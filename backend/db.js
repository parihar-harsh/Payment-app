const mongoose = require('mongoose');
const { MONGODB_URI, REQUIRE_TRANSACTIONS } = require("./config");

mongoose.set("strictQuery", true);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 254
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
}, {
    timestamps: true
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    balance: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        enum: ["INR"],
        default: "INR",
        immutable: true
    }
}, {
    timestamps: true
});

const transferSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    currency: {
        type: String,
        enum: ["INR"],
        default: "INR",
        immutable: true
    }
}, {
    timestamps: true
});

transferSchema.index({ fromUserId: 1, createdAt: -1 });
transferSchema.index({ toUserId: 1, createdAt: -1 });

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);
const Transfer = mongoose.model("Transfer", transferSchema);

const connectDB = async () => {
    await mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 10_000
    });

    if (REQUIRE_TRANSACTIONS) {
        const hello = await mongoose.connection.db.admin().command({ hello: 1 });
        const supportsTransactions = Boolean(hello.setName || hello.msg === "isdbgrid");

        if (!supportsTransactions) {
            await mongoose.disconnect();
            throw new Error(
                "MongoDB transactions require a replica set or mongos. " +
                "Set REQUIRE_TRANSACTIONS=false only for non-transfer development work."
            );
        }
    }
};

const disconnectDB = () => mongoose.disconnect();

module.exports = {
    User,
    Account,
    Transfer,
    connectDB,
    disconnectDB
};
