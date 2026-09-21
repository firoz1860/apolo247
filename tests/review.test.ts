import { describe, it, expect } from 'vitest';
import { createReviewSchema, averageRating } from '@/lib/validation/review';

describe('createReviewSchema', () => {
  it('accepts a valid rating with a comment', () => {
    expect(createReviewSchema.safeParse({ rating: 5, comment: 'Great doctor' }).success).toBe(true);
  });

  it('accepts a rating with no comment', () => {
    expect(createReviewSchema.safeParse({ rating: 3 }).success).toBe(true);
  });

  it('rejects a rating below 1', () => {
    expect(createReviewSchema.safeParse({ rating: 0 }).success).toBe(false);
  });

  it('rejects a rating above 5', () => {
    expect(createReviewSchema.safeParse({ rating: 6 }).success).toBe(false);
  });

  it('rejects a non-integer rating', () => {
    expect(createReviewSchema.safeParse({ rating: 4.5 }).success).toBe(false);
  });

  it('rejects an over-long comment', () => {
    expect(createReviewSchema.safeParse({ rating: 4, comment: 'x'.repeat(1001) }).success).toBe(false);
  });
});

describe('averageRating', () => {
  it('returns 0 for no ratings', () => {
    expect(averageRating([])).toBe(0);
  });

  it('averages and rounds to one decimal', () => {
    expect(averageRating([5, 4, 4])).toBe(4.3);
    expect(averageRating([5, 5, 5])).toBe(5);
    expect(averageRating([1, 2])).toBe(1.5);
  });
});
