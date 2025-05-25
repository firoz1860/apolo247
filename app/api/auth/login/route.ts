// import { NextRequest, NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/db/dbConnect';
// import User from '@/lib/db/models/User';
// import { generateToken } from '@/lib/auth/jwt';

// export async function POST(request: NextRequest) {
//   try {
//     await dbConnect();
    
//     const { email, password } = await request.json();
    
//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }
    
//     // Check password
//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { success: false, error: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }
    
//     // Generate JWT token
//     const token = generateToken(user._id.toString());

//     // Create response and set cookie
//     const response = NextResponse.json({
//       success: true,
//       data: {
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email
//         }
//       }
//     });

//     response.cookies.set('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7 // 7 days
//     });

//     return response;

//   } catch (error) {
//     console.error('Error in login:', error);
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/dbConnect';
import User from '@/lib/db/models/User';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    const response = NextResponse.json({
      success: true,
      token: token, 
      url: '/',     
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
