import { describe, it, expect, beforeAll } from 'vitest';
import { generateToken, verifyToken } from '@/lib/auth/jwt';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
});

describe('jwt', () => {
  it('round-trips a userId through generate/verify', () => {
    const token = generateToken('user-123');
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe('user-123');
  });

  it('throws "Invalid token" for a tampered token', () => {
    const token = generateToken('user-123');
    const tampered = token.slice(0, -2) + 'xx';
    expect(() => verifyToken(tampered)).toThrow('Invalid token');
  });

  it('throws "Invalid token" for garbage input', () => {
    expect(() => verifyToken('not-a-jwt')).toThrow('Invalid token');
  });

  it('rejects a token signed with a different secret', () => {
    const token = generateToken('user-123');
    process.env.JWT_SECRET = 'a-different-secret';
    expect(() => verifyToken(token)).toThrow('Invalid token');
    process.env.JWT_SECRET = 'test-secret';
  });
});
