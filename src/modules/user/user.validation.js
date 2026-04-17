const { z } = require("zod");

const createOrGetUserSchema = z.object({
    body: z.object({
        username: z.string().min(2, "Username must be at least 2 characters"),
    }),
});

module.exports = {
    createOrGetUserSchema,
};
