import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apollo247clone';


// Track connection status
let isConnected = false;

/**
 * Connect to MongoDB database
 */
export const dbConnect = async () => {
  console.log('MongoDB URI:', MONGODB_URI);
  if (isConnected) {
    return;
  }
  
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
};

/**
 * Disconnect from MongoDB database
*/
export const dbDisconnect = async () => {
  if (!isConnected) {
    return;
  }
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.log('🛑 MongoDB disconnected');
    throw new Error('Error disconnecting from database');
  }
};

// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error(
//     '❌ Please define the MONGODB_URI environment variable inside .env.local'
//   );
// }

// // Global connection cache (for hot-reloading in development)
// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// /**
//  * Connect to MongoDB (singleton pattern)
//  */
// export const dbConnect = async () => {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
//       console.log('✅ MongoDB connected');
//       return mongoose;
//     }).catch((err) => {
//       console.error('❌ MongoDB connection error:', err);
//       throw new Error('MongoDB connection failed');
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// };

// /**
//  * Optional: Disconnect from MongoDB
//  * (used in testing or script teardown)
//  */
// export const dbDisconnect = async () => {
//   if (cached.conn) {
//     await mongoose.disconnect();
//     cached.conn = null;
//     console.log('🛑 MongoDB disconnected');
//   }
// };

//*/