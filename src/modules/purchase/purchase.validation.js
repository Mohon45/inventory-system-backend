const { z } = require('zod');

const completePurchaseSchema = z.object({
  body: z.object({
    reservation_id: z.string().uuid('Invalid reservation ID'),
    user_id: z.string().uuid('Invalid user ID')
  })
});

module.exports = {
  completePurchaseSchema
};
