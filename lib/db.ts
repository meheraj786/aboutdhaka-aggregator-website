import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and across function invocations in serverless environments.
 */
interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	// eslint-disable-next-line no-var
	var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
	global.mongooseCache = { conn: null, promise: null };
}

const cached = global.mongooseCache;

export async function dbConnect() {
	// If already connected, return the connection
	if (cached.conn && cached.conn.connection.readyState === 1) {
		return cached.conn;
	}

	// If a connection is in progress, wait for it
	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			serverSelectionTimeoutMS: 10000, // 10s timeout for cold start
			socketTimeoutMS: 45000,
			maxPoolSize: 10,
			minPoolSize: 1,
		};

		console.log("🔄 Connecting to MongoDB...");
		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				console.log("✅ MongoDB Connected Successfully");
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("❌ MongoDB Connection Error:", err.message);
				cached.promise = null; // Reset promise on error
				throw err;
			});
	} else {
		console.log("⏳ Waiting for existing MongoDB connection promise...");
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null; // Reset promise if awaiting fails
		throw error;
	}

	// Double-check if we actually got a connection
	if (cached.conn.connection.readyState !== 1) {
		console.warn(
			"⚠️ Connection resolved but state is not 1 (connected). Resetting promise.",
		);
		cached.promise = null;
		cached.conn = null;
		// Recursively try once more if needed, or just throw
		throw new Error("Failed to establish a valid MongoDB connection.");
	}

	return cached.conn;
}
