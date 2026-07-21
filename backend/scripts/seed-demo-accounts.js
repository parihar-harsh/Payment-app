const { connectDB, disconnectDB } = require("../db");
const { seedDemoAccounts } = require("../seedDemoAccounts");

async function main() {
    await connectDB();
    await seedDemoAccounts();
}

main()
    .catch(error => {
        console.error("Failed to seed demo accounts", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await disconnectDB().catch(() => {});
    });
