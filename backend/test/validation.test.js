const test = require("node:test");
const assert = require("node:assert/strict");
const {
    signupBody,
    updateBody,
    transferBody,
    searchQuery,
    parse
} = require("../validation");

test("signup normalizes an email and trims names", () => {
    const result = parse(signupBody, {
        username: "  PERSON@Example.COM ",
        firstName: "  Ada ",
        lastName: " Lovelace  ",
        password: "correct-horse"
    });

    assert.equal(result.username, "person@example.com");
    assert.equal(result.firstName, "Ada");
    assert.equal(result.lastName, "Lovelace");
});

test("signup rejects short passwords and unknown fields", () => {
    assert.throws(() => parse(signupBody, {
        username: "person@example.com",
        firstName: "Ada",
        lastName: "Lovelace",
        password: "short",
        role: "admin"
    }), { name: "RequestValidationError" });
});

test("profile update requires at least one supported field", () => {
    assert.throws(
        () => parse(updateBody, {}),
        { name: "RequestValidationError" }
    );
});

test("transfer accepts a positive integer supplied by the browser", () => {
    const result = parse(transferBody, {
        amount: "250",
        to: "507f1f77bcf86cd799439011"
    });

    assert.equal(result.amount, 250);
});

test("transfer rejects negative, fractional, and malformed values", () => {
    for (const amount of [-100, 0, 1.5, "not-a-number"]) {
        assert.throws(
            () => parse(transferBody, {
                amount,
                to: "507f1f77bcf86cd799439011"
            }),
            { name: "RequestValidationError" }
        );
    }
});

test("search pagination has bounded defaults", () => {
    const result = parse(searchQuery, {});
    assert.deepEqual(result, {
        filter: "",
        page: 1,
        limit: 20
    });

    assert.throws(
        () => parse(searchQuery, { limit: 1000 }),
        { name: "RequestValidationError" }
    );
});
