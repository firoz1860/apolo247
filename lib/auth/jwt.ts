import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '7d';

/**
 * Resolve the JWT secret. In production a strong secret is mandatory; falling
 * back to a hard-coded default there would let anyone forge valid tokens.
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable must be set in production');
    }
    return 'dev-only-insecure-secret';
  }

  return secret;
};

export interface JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    if (!decoded?.userId) {
      throw new Error('Token verification failed');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
