const prisma = require("../../config/prisma");

const createOrGetUser = async (username) => {
    const trimmed = username.trim();
    const existing = await prisma.user.findUnique({
        where: { username: trimmed },
    });

    if (existing) return { user: existing, isNew: false };
    const user = await prisma.user.create({ data: { username: trimmed } });
    return { user, isNew: true };
};

module.exports = { createOrGetUser };
