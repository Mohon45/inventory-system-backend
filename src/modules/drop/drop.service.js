const prisma = require("../../config/prisma");
const ApiError = require("../../utils/ApiError");

const createDrop = async ({
    name,
    description,
    price,
    total_stock,
    image_url,
    starts_at,
}) => {
    const stock = parseInt(total_stock);
    return prisma.drop.create({
        data: {
            name: name.trim(),
            description: description?.trim() || null,
            price: parseFloat(price),
            totalStock: stock,
            availableStock: stock,
            imageUrl: image_url?.trim() || null,
            startsAt: starts_at ? new Date(starts_at) : new Date(),
        },
    });
};

const getActiveDrops = async () => {
    return prisma.drop.findMany({
        where: { isActive: true, startsAt: { lte: new Date() } },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            totalStock: true,
            availableStock: true,
            imageUrl: true,
            startsAt: true,
            purchases: {
                orderBy: { createdAt: "desc" },
                take: 3,
                select: {
                    id: true,
                    createdAt: true,
                    user: { select: { username: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

const getDropById = async (id) => {
    const drop = await prisma.drop.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            totalStock: true,
            availableStock: true,
            imageUrl: true,
            startsAt: true,
            isActive: true,
        },
    });
    if (!drop) throw new ApiError(404, "Drop not found");
    return drop;
};

const deactivateDrop = async (id) => {
    await getDropById(id);
    return prisma.drop.update({
        where: { id },
        data: { isActive: false },
    });
};

module.exports = { createDrop, getActiveDrops, getDropById, deactivateDrop };
