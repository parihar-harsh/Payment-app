const test = require("node:test");
const assert = require("node:assert/strict");

process.env.JWT_SECRET = "0123456789abcdef0123456789abcdef";

const app = require("../app");

const withServer = async callback => {
    const server = app.listen(0);
    await new Promise(resolve => server.once("listening", resolve));

    try {
        const { port } = server.address();
        await callback(`http://127.0.0.1:${port}`);
    } finally {
        await new Promise((resolve, reject) => {
            server.close(error => error ? reject(error) : resolve());
        });
    }
};

test("health reports a disconnected database as unavailable", async () => {
    await withServer(async baseUrl => {
        const response = await fetch(`${baseUrl}/health`);
        const body = await response.json();

        assert.equal(response.status, 503);
        assert.deepEqual(body, {
            status: "unavailable",
            database: "disconnected"
        });
    });
});

test("unknown routes return the standard error envelope", async () => {
    await withServer(async baseUrl => {
        const response = await fetch(`${baseUrl}/missing`);
        const body = await response.json();

        assert.equal(response.status, 404);
        assert.equal(body.error.code, "NOT_FOUND");
    });
});

test("CORS rejects origins outside the configured allowlist", async () => {
    await withServer(async baseUrl => {
        const response = await fetch(`${baseUrl}/health`, {
            headers: {
                Origin: "https://untrusted.example"
            }
        });
        const body = await response.json();

        assert.equal(response.status, 403);
        assert.equal(body.error.code, "CORS_DENIED");
    });
});
