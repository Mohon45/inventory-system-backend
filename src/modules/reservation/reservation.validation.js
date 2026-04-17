const { z } = require('zod');

const createReservationSchema = z.object({
  body: z.object({
    drop_id: z.string().uuid('Invalid drop ID'),
    user_id: z.string().uuid('Invalid user ID')
  })
});

const getUserReservationsSchema = z.object({
  params: z.object({
    userId: z.string().uuid('Invalid user ID')
  })
});

module.exports = {
  createReservationSchema,
  getUserReservationsSchema
};
