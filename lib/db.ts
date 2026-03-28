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
	var __mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.__mongooseCache || {
	conn: null,
	promise: null,
};

if (!global.__mongooseCache) {
	global.__mongooseCache = cached;
}

export async function dbConnect() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
			serverSelectionTimeoutMS: 8000,
			socketTimeoutMS: 45000,
			maxPoolSize: 10,
			minPoolSize: 1,
		};

		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				console.log("New MongoDB connection established");
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("MongoDB connection error:", err.message);
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
