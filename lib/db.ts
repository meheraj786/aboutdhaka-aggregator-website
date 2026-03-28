import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	// eslint-disable-next-line no-var
	var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
	conn: null,
	promise: null,
};

if (!global.mongooseCache) {
	global.mongooseCache = cached;
}

export async function dbConnect() {
	if (cached.conn?.connection.readyState === 1) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			serverSelectionTimeoutMS: 8000, // cold start e fast fail
			socketTimeoutMS: 45000,
			maxPoolSize: 5, // Vercel free/paid e safe
			minPoolSize: 1,
		};

		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				console.log("✅ MongoDB Connected Successfully");
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("❌ MongoDB Connection Error:", err.message);
				cached.promise = null;
				throw err;
			});
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	return cached.conn;
}
