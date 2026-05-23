// app/api/stops/nearest/route.ts
// This is a SERVER-ONLY file. No "use client" here ever.

import { type NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Area, BusStop } from "@/models";

function haversineMeters(
	lat1: number,
	lng1: number,
	lat2: number,
	lng2: number,
): number {
	const R = 6371000;
	const toRad = (deg: number) => (deg * Math.PI) / 180;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const lat = Number(searchParams.get("lat"));
		const lng = Number(searchParams.get("lng"));

		if (Number.isNaN(lat) || Number.isNaN(lng)) {
			return NextResponse.json(
				{ success: false, message: "Invalid lat/lng" },
				{ status: 400 },
			);
		}

		await dbConnect();

		const allStops = await BusStop.find({}).lean();
		console.log(allStops[0]);

		if (!allStops.length) {
			return NextResponse.json(
				{ success: false, message: "No stops found" },
				{ status: 404 },
			);
		}

		let nearest = null;
		let minDist = Infinity;

		for (const stop of allStops) {
			const coords = stop.location?.coordinates;
			if (!coords || coords.length < 2) continue;
			const [stopLng, stopLat] = coords; // GeoJSON: [lng, lat]
			const dist = haversineMeters(lat, lng, stopLat, stopLng);
			if (dist < minDist) {
				minDist = dist;
				nearest = stop;
			}
		}

		if (!nearest) {
			return NextResponse.json(
				{ success: false, message: "No nearby stop found" },
				{ status: 404 },
			);
		}

		const area = await Area.findOne({ "stops.stop": nearest._id }).lean();

		return NextResponse.json({
			success: true,
			data: {
				stopId: String(nearest._id),
				areaId: area ? String(area._id) : "",
				stopName: nearest.stopName,
				distance: Math.round(minDist),
			},
		});
	} catch (err) {
		console.error("nearest stop error:", err);
		return NextResponse.json(
			{ success: false, message: "Server error" },
			{ status: 500 },
		);
	}
}
