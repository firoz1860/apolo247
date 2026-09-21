import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbConnect } from '@/lib/db/dbConnect';
import User from '@/lib/db/models/User';
import { generateToken } from '@/lib/auth/jwt';

/**
 * POST /api/auth/guest
 * Create a throwaway guest account and return a real JWT, so a visitor can try
 * authenticated features (booking, cart, records) without signing up.
 */
export async function POST() {
  try {
    await dbConnect();

    const suffix = crypto.randomBytes(6).toString('hex');
    const password = crypto.randomBytes(16).toString('hex');

    const user = new User({
      name: 'Guest User',
      email: `guest_${suffix}@guest.apollo247.local`,
      password,
    });
    await user.save();

    const token = generateToken(user._id.toString());

    const response = NextResponse.json(
      {
        success: true,
        token,
        data: {
          user: { id: user._id, name: user.name, email: user.email, isGuest: true },
        },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // guest sessions last a day
    });

    return response;
  } catch (error) {
    console.error('Guest login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
