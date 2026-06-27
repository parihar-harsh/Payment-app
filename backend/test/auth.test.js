const test = require("node:test");
const assert = require("node:assert/strict");
const { SignJWT } = require("jose");

process.env.JWT_SECRET = "0123456789abcdef0123456789abcdef";

const { authMiddleware } = require("../middleware");

const runMiddleware = async authorization => {
    const req = { headers: { authorization } };
    let status;
    let body;
    let nextCalled = false;
    const res = {
        status(value) {
            status = value;
            return this;
        },
        json(value) {
            body = value;
            return this;
        }
    };

    await authMiddleware(req, res, () => {
        nextCalled = true;
    });

    return { req, status, body, nextCalled };
};

test("authentication rejects a missing bearer token", async () => {
    const result = await runMiddleware(undefined);
    assert.equal(result.status, 401);
    assert.equal(result.body.error.code, "AUTHENTICATION_REQUIRED");
    assert.equal(result.nextCalled, false);
});

test("authentication accepts a valid application token", async () => {
    const userId = "507f1f77bcf86cd799439011";
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuer("payment-app")
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(secret);

    const result = await runMiddleware(`Bearer ${token}`);
    assert.equal(result.req.userId, userId);
    assert.equal(result.nextCalled, true);
});

test("authentication rejects tokens from another issuer", async () => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
        userId: "507f1f77bcf86cd799439011"
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuer("another-service")
        .setExpirationTime("5m")
        .sign(secret);

    const result = await runMiddleware(`Bearer ${token}`);
    assert.equal(result.status, 401);
    assert.equal(result.body.error.code, "INVALID_TOKEN");
});
