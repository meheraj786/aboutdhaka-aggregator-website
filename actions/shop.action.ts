"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/db";
import { Shop, type IShop } from "@/models/shop.model";
import type { ShopInput } from "@/validators/pcComponent";

function serializeData<T>(data: T): T {
	if (data === null || data === undefined) return data;
	if (typeof data === "object" && data.constructor?.name === "ObjectId")
		return (data as { toString(): string }).toString() as unknown as T;
	if (data instanceof Date) return data.toISOString() as unknown as T;
	if (Array.isArray(data)) return data.map(serializeData) as unknown as T;
	if (typeof data === "object") {
		const result: Record<string, unknown> = {};
		for (const key in data)
			if (Object.hasOwn(data, key))
				result[key] = serializeData((data as Record<string, unknown>)[key]);
		return result as T;
	}
	return data;
}

export interface IShopPopulated {
	_id: string;
	name: string;
	location: string;
	lat?: number;
	long?: number;
	rating?: number;
	website?: string;
	phone?: string;
	createdAt: string;
	updatedAt: string;
}

export async function getShops(): Promise<IShopPopulated[]> {
	await dbConnect();
	const shops = await Shop.find({}).sort({ name: 1 }).lean();
	return serializeData(shops as unknown as IShopPopulated[]);
}

export async function createShop(data: ShopInput) {
	await dbConnect();
	const shop = await Shop.create(data as unknown as IShop);
	revalidatePath("/dashboard/shops");
	return serializeData(shop.toObject() as unknown as IShopPopulated);
}

export async function updateShop(id: string, data: ShopInput) {
	await dbConnect();
	const shop = await Shop.findByIdAndUpdate(id, data as unknown as IShop, {
		new: true,
	});
	if (!shop) throw new Error("Shop not found");
	revalidatePath("/dashboard/shops");
	return serializeData(shop.toObject() as unknown as IShopPopulated);
}

export async function deleteShop(id: string) {
	await dbConnect();
	await Shop.findByIdAndDelete(id);
	revalidatePath("/dashboard/shops");
	return { success: true };
}
