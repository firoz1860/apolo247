import { describe, it, expect, beforeAll } from 'vitest';
import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { generateToken } from '@/lib/auth/jwt';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

const makeRequest = (headers: Record<string, string> = {}) =>
  new NextRequest('http://localhost/api/doctors', { headers });

describe('requireAuth', () => {
  it('rejects a request with no Authorization header (401)', () => {
    const result = requireAuth(makeRequest());
    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(401);
    expect(result.userId).toBeUndefined();
  });

  it('rejects a malformed Authorization header (401)', () => {
    const result = requireAuth(makeRequest({ authorization: 'Token abc' }));
    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(401);
  });

  it('rejects an invalid bearer token (401)', () => {
    const result = requireAuth(makeRequest({ authorization: 'Bearer not-valid' }));
    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(401);
  });

  it('accepts a valid bearer token and returns the userId', () => {
    const token = generateToken('user-42');
    const result = requireAuth(makeRequest({ authorization: `Bearer ${token}` }));
    expect(result.error).toBeUndefined();
    expect(result.userId).toBe('user-42');
  });
});
