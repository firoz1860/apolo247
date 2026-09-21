import { z } from 'zod';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const catalogQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: objectId,
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, 'Your cart is empty'),
});
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const bookLabTestSchema = z.object({
  testId: objectId,
  date: dateString,
});
export type BookLabTestInput = z.infer<typeof bookLabTestSchema>;
