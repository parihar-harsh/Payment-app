const app = require("./app");
const { connectDB, disconnectDB } = require("./db");
const { HOST, PORT, SEED_DEMO_ACCOUNTS } = require("./config");
const { seedDemoAccounts } = require("./seedDemoAccounts");

let server;

const start = async () => {
    await connectDB();

    if (SEED_DEMO_ACCOUNTS) {
        await seedDemoAccounts();
    }

    server = app.listen(PORT, HOST, () => {
        console.log(`API listening on ${HOST}:${PORT}`);
    });
};

const shutdown = signal => {
    console.log(`${signal} received; shutting down`);

    const forceExit = setTimeout(() => {
        console.error("Graceful shutdown timed out");
        process.exit(1);
    }, 10_000);
    forceExit.unref();

    const finish = async () => {
        try {
            await disconnectDB();
            process.exit(0);
        } catch (error) {
            console.error("Shutdown failed", error);
            process.exit(1);
        }
    };

    if (server) {
        server.close(finish);
    } else {
        finish();
    }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start().catch(error => {
    console.error("Failed to start API", error);
    process.exit(1);
});
