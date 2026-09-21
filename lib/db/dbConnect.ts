import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/apollo247clone';

/**
 * Cache the Mongoose connection across hot-reloads in development and across
 * invocations in a serverless environment. Without this, every request (or
 * every HMR reload) would open a brand new connection and eventually exhaust
 * the connection pool.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global._mongooseCache || (global._mongooseCache = { conn: null, promise: null });

/**
 * Connect to MongoDB using a cached singleton connection.
 */
export const dbConnect = async (): Promise<typeof mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        console.log('✅ MongoDB connected successfully');
        return m;
      })
      .catch((error) => {
        // Reset the promise so a later request can retry the connection.
        cached.promise = null;
        console.error('❌ MongoDB connection error:', error);
        throw new Error('MongoDB connection failed');
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

/**
 * Disconnect from MongoDB (used in tests and script teardown).
 */
export const dbDisconnect = async (): Promise<void> => {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🛑 MongoDB disconnected');
  }
};
