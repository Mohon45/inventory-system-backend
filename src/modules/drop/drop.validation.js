const { z } = require('zod');

const createDropSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().min(0, 'Price must be 0 or greater'),
    total_stock: z.number().int().min(1, 'Total stock must be at least 1'),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    startsAt: z.string().datetime().optional()
  })
});

const getDropSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid drop ID')
  })
});

const deactivateDropSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid drop ID')
  })
});

module.exports = {
  createDropSchema,
  getDropSchema,
  deactivateDropSchema
};
