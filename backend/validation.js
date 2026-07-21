const zod = require("zod");

const objectId = zod.string().regex(/^[a-f\d]{24}$/i, "Invalid user id");
const password = zod.string().min(8).max(72);
const name = zod.string().trim().min(1).max(50);

const signupBody = zod.object({
    username: zod.string().trim().email().max(254).transform(value => value.toLowerCase()),
    firstName: name,
    lastName: name,
    password
}).strict();

const signinBody = zod.object({
    username: zod.string().trim().email().max(254).transform(value => value.toLowerCase()),
    password: zod.string().min(1).max(72)
}).strict();

const updateBody = zod.object({
    password: password.optional(),
    firstName: name.optional(),
    lastName: name.optional()
}).strict().refine(value => Object.keys(value).length > 0, {
    message: "At least one field is required"
});

const transferBody = zod.object({
    amount: zod.coerce.number().int().positive().max(10_000_000),
    to: objectId
}).strict();

const searchQuery = zod.object({
    filter: zod.string().trim().max(50).default(""),
    page: zod.coerce.number().int().positive().default(1),
    limit: zod.coerce.number().int().min(1).max(50).default(20)
}).strict();

const paginationQuery = zod.object({
    page: zod.coerce.number().int().positive().default(1),
    limit: zod.coerce.number().int().min(1).max(100).default(20)
}).strict();

const transactionCursorQuery = zod.object({
    cursor: zod.string().trim().min(1).max(512).optional(),
    limit: zod.coerce.number().int().min(1).max(100).default(20)
}).strict();

const parse = (schema, value) => {
    const result = schema.safeParse(value);

    if (!result.success) {
        const error = new Error("Validation failed");
        error.name = "RequestValidationError";
        error.details = result.error.flatten();
        throw error;
    }

    return result.data;
};

module.exports = {
    signupBody,
    signinBody,
    updateBody,
    transferBody,
    searchQuery,
    paginationQuery,
    transactionCursorQuery,
    parse
};
