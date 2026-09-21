import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export interface AuthResult {
  userId: string;
}

/**
 * Extract and verify the bearer token from a request.
 *
 * Returns either the authenticated `userId` or a ready-to-send `NextResponse`
 * describing why authentication failed. Route handlers call this and return the
 * response immediately when `error` is present.
 */
export function requireAuth(
  request: NextRequest
): { userId: string; error?: undefined } | { userId?: undefined; error: NextResponse } {
  const authHeader = request.headers.get('authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(' ')[1];

  try {
    const { userId } = verifyToken(token);
    return { userId };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      ),
    };
  }
}
