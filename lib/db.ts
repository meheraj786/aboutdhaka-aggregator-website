import mongoose from "mongoose";
import "@/models";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongooseCache {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

declare global {
	var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
	global.mongooseCache = { conn: null, promise: null };
}

const cached = global.mongooseCache;

export async function dbConnect() {
	const opts = {
		bufferCommands: false,
		serverSelectionTimeoutMS: 10000,
		socketTimeoutMS: 45000,
		maxPoolSize: 10,
		minPoolSize: 1,
	};

	if (cached.conn && cached.conn.connection.readyState === 1) {
		return cached.conn;
	}

	if (!cached.promise) {
		console.log("🔄 Connecting to MongoDB...");
		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				if (mongooseInstance.connection.readyState !== 1) {
					throw new Error(
						"MongoDB connection resolved without a connected state.",
					);
				}
				console.log("✅ MongoDB Connected Successfully");
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("❌ MongoDB Connection Error:", err.message);
				cached.promise = null;
				cached.conn = null;
				throw err;
			});
	} else {
		console.log("⏳ Waiting for existing MongoDB connection promise...");
	}

	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		throw error;
	}

	if (cached.conn.connection.readyState !== 1) {
		console.warn(
			"⚠️ Connection resolved but state is not 1 (connected). Attempting recovery.",
		);
		await mongoose.disconnect().catch(() => {});
		cached.promise = null;
		cached.conn = null;

		console.log("🔁 Retrying MongoDB connection after stale state...");
		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongooseInstance) => {
				if (mongooseInstance.connection.readyState !== 1) {
					throw new Error("MongoDB retry resolved without a connected state.");
				}
				console.log("✅ MongoDB Reconnected Successfully");
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("❌ MongoDB Retry Error:", err.message);
				cached.promise = null;
				cached.conn = null;
				throw err;
			});

		cached.conn = await cached.promise;
	}

	if (cached.conn.connection.readyState !== 1) {
		console.warn(
			"⚠️ MongoDB retry did not produce a connected state. Resetting promise.",
		);
		cached.promise = null;
		cached.conn = null;
		throw new Error("Failed to establish a valid MongoDB connection.");
	}

	return cached.conn;
}
