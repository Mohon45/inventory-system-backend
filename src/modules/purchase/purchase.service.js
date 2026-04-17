const { Prisma } = require("@prisma/client");
const prisma = require("../../config/prisma");
const ApiError = require("../../utils/ApiError");
const { cancelExpiration } = require("../reservation/reservation.expiration");
const { getIO } = require("../../socket");

const completePurchase = async (reservationId, userId) => {
    const purchase = await prisma.$transaction(
        async (tx) => {
            const reservation = await tx.reservation.findFirst({
                where: { id: reservationId, userId, status: "ACTIVE" },
                include: { drop: { select: { price: true } } },
            });

            if (!reservation)
                throw new ApiError(404, "Active reservation not found");
            if (new Date() > new Date(reservation.expiresAt)) {
                throw new ApiError(409, "Reservation has expired");
            }

            await tx.reservation.update({
                where: { id: reservationId },
                data: { status: "PURCHASED" },
            });

            return tx.purchase.create({
                data: {
                    reservationId,
                    dropId: reservation.dropId,
                    userId,
                    pricePaid: reservation.drop.price,
                },
            });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    cancelExpiration(reservationId);

    const [drop, user] = await Promise.all([
        prisma.drop.findUnique({
            where: { id: purchase.dropId },
            select: { availableStock: true },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { username: true },
        }),
    ]);

    getIO().emit("purchase:completed", {
        dropId: purchase.dropId,
        availableStock: drop.availableStock,
        purchaser: { username: user.username },
        purchaseId: purchase.id,
    });

    return purchase;
};

const getUserPurchases = async (userId) => {
    return prisma.purchase.findMany({
        where: { userId },
        include: { drop: true },
        orderBy: { createdAt: 'desc' }
    });
};

module.exports = { completePurchase, getUserPurchases };
