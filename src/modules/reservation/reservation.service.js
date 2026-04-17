const { Prisma } = require('@prisma/client');
const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');
const { scheduleExpiration } = require('./reservation.expiration');
const { getIO } = require('../../socket');

const RESERVATION_DURATION_MS = 60 * 1000;

const createReservation = async (dropId, userId) => {
  const reservation = await prisma.$transaction(
    async (tx) => {
      const existing = await tx.reservation.findFirst({
        where: { dropId, userId, status: 'ACTIVE' },
      });

      if (existing) {
        throw new ApiError(409, 'You already have an active reservation for this item');
      }

      const updated = await tx.drop.updateMany({
        where: { id: dropId, isActive: true, availableStock: { gt: 0 } },
        data: { availableStock: { decrement: 1 } },
      });

      if (updated.count === 0) {
        throw new ApiError(409, 'Item is out of stock');
      }

      const expiresAt = new Date(Date.now() + RESERVATION_DURATION_MS);
      return tx.reservation.create({
        data: { dropId, userId, status: 'ACTIVE', expiresAt },
      });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  scheduleExpiration(reservation.id, reservation.expiresAt);

  const drop = await prisma.drop.findUnique({
    where: { id: dropId },
    select: { availableStock: true },
  });

  getIO().emit('stock:updated', { dropId, availableStock: drop.availableStock });

  return reservation;
};

const getUserReservations = async (userId) => {
  return prisma.reservation.findMany({
    where: { userId, status: 'ACTIVE' },
    include: {
      drop: {
        select: { id: true, name: true, price: true, imageUrl: true, availableStock: true },
      },
    },
  });
};

module.exports = { createReservation, getUserReservations };
