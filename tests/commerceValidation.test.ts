import { describe, it, expect } from 'vitest';
import {
  placeOrderSchema,
  bookLabTestSchema,
  catalogQuerySchema,
} from '@/lib/validation/commerce';

const validId = 'a'.repeat(24);

describe('placeOrderSchema', () => {
  it('accepts a valid order', () => {
    const result = placeOrderSchema.safeParse({
      items: [{ productId: validId, quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty cart', () => {
    expect(placeOrderSchema.safeParse({ items: [] }).success).toBe(false);
  });

  it('rejects a zero quantity', () => {
    const result = placeOrderSchema.safeParse({
      items: [{ productId: validId, quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects a bad product id', () => {
    const result = placeOrderSchema.safeParse({
      items: [{ productId: 'bad', quantity: 1 }],
    });
    expect(result.success).toBe(false);
  });
});

describe('bookLabTestSchema', () => {
  it('accepts a valid booking', () => {
    expect(
      bookLabTestSchema.safeParse({ testId: validId, date: '2025-01-06' }).success
    ).toBe(true);
  });

  it('rejects a malformed date', () => {
    expect(
      bookLabTestSchema.safeParse({ testId: validId, date: '6 Jan 2025' }).success
    ).toBe(false);
  });
});

describe('catalogQuerySchema', () => {
  it('applies defaults', () => {
    const result = catalogQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(12);
  });

  it('coerces numeric strings and keeps filters', () => {
    const result = catalogQuerySchema.parse({
      page: '2',
      limit: '20',
      search: 'para',
      category: 'Pain Relief',
    });
    expect(result).toEqual({ page: 2, limit: 20, search: 'para', category: 'Pain Relief' });
  });

  it('rejects an over-large limit', () => {
    expect(catalogQuerySchema.safeParse({ limit: '500' }).success).toBe(false);
  });
});
