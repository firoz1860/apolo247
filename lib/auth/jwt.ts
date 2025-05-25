import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d'; 

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if(!decoded){
      throw new Error('Token verification failed');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
  
};

// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
// const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
// import jwt from "jsonwebtoken";

// const ACCESS_TOKEN_EXPIRES_IN = "15m"; // Short-lived
// const REFRESH_TOKEN_EXPIRES_IN = "7d"; // Long-lived

// // Generate Access Token
// export const generateAccessToken = (userId: string): string => {
//   return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
//     expiresIn: ACCESS_TOKEN_EXPIRES_IN,
//   });
// };

// // Generate Refresh Token
// export const generateRefreshToken = (userId: string): string => {
//   return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
//     expiresIn: REFRESH_TOKEN_EXPIRES_IN,
//   });
// };

// // Verify Access Token
// export const verifyAccessToken = (token: string): { userId: string } => {
//   try {
//     return jwt.verify(token, ACCESS_TOKEN_SECRET) as { userId: string };
//   } catch (error) {
//     throw new Error("Invalid access token");
//   }
// };

// // Verify Refresh Token
// export const verifyRefreshToken = (token: string): { userId: string } => {
//   try {
//     return jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
//   } catch (error) {
//     throw new Error("Invalid refresh token");
//   }
// };