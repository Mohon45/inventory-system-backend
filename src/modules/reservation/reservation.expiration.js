const { Prisma } = require("@prisma/client");
const prisma = require("../../config/prisma");
const { getIO } = require("../../socket");

const activeTimers = new Map();

async function expireReservation(reservationId) {
    const reservation = await prisma.$transaction(
        async (tx) => {
            const res = await tx.reservation.findFirst({
                where: { id: reservationId, status: "ACTIVE" },
            });

            if (!res) return null;

            await tx.reservation.update({
                where: { id: reservationId },
                data: { status: "EXPIRED" },
            });

            await tx.drop.update({
                where: { id: res.dropId },
                data: { availableStock: { increment: 1 } },
            });

            return res;
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    if (!reservation) return;

    activeTimers.delete(reservationId);

    const drop = await prisma.drop.findUnique({
        where: { id: reservation.dropId },
        select: { availableStock: true },
    });

    const io = getIO();
    io.emit("stock:updated", {
        dropId: reservation.dropId,
        availableStock: drop.availableStock,
    });
    io.emit("reservation:expired", {
        reservationId,
        dropId: reservation.dropId,
        userId: reservation.userId,
    });
}

function scheduleExpiration(reservationId, expiresAt) {
    const delay = new Date(expiresAt).getTime() - Date.now();
    if (delay <= 0) {
        expireReservation(reservationId);
        return;
    }
    const timer = setTimeout(() => expireReservation(reservationId), delay);
    activeTimers.set(reservationId, timer);
}

function cancelExpiration(reservationId) {
    const timer = activeTimers.get(reservationId);
    if (timer) {
        clearTimeout(timer);
        activeTimers.delete(reservationId);
    }
}

async function startCleanupJob() {
    const overdueReservations = await prisma.reservation.findMany({
        where: { status: "ACTIVE", expiresAt: { lte: new Date() } },
    });

    for (const res of overdueReservations) {
        await expireReservation(res.id);
    }

    const activeReservations = await prisma.reservation.findMany({
        where: { status: "ACTIVE", expiresAt: { gt: new Date() } },
    });

    for (const res of activeReservations) {
        scheduleExpiration(res.id, res.expiresAt);
    }

    // Disable background interval in production (Vercel serverless)
    if (process.env.NODE_ENV !== "production") {
        setInterval(async () => {
            const overdue = await prisma.reservation.findMany({
                where: { status: "ACTIVE", expiresAt: { lte: new Date() } },
            });
            for (const res of overdue) {
                if (!activeTimers.has(res.id)) {
                    await expireReservation(res.id);
                }
            }
        }, 30000);
    }
}

module.exports = { scheduleExpiration, cancelExpiration, startCleanupJob };
