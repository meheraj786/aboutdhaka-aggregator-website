"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
	MapContainer,
	Marker,
	Polyline,
	TileLayer,
	useMap,
} from "react-leaflet";

const departureIcon = L.icon({
	iconUrl:
		"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjMiPjxwYXRoIGZpbGw9IiMxNDVERkMiIGQ9Ik00MiAyMWMwIDEyLjkxOS0xMy4zNSAyMi4xMjgtMTcuMDU2IDI0LjQzNmExLjc3IDEuNzcgMCAwIDEtMS44ODggMEMxOS4zNTEgNDMuMTI4IDYgMzMuOTE5IDYgMjFjMC05Ljk0MSA4LjA1OS0xOCAxOC0xOHMxOCA4LjA1OSAxOCAxOCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMiAyMWE4IDggMCAxIDEtMTYgMGE4IDggMCAwIDEgMTYgMCIvPjxwYXRoIHN0cm9rZT0iIzI4NTljNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNDIgMjFjMCAxMi45MTktMTMuMzUgMjIuMTI4LTE3LjA1NiAyNC40MzZhMS43NyAxLjc3IDAgMCAxLTEuODg4IDBDMTkuMzUxIDQzLjEyOCA2IDMzLjkxOSA2IDIxYzAtOS45NDEgOC4wNTktMTggMTgtMThzMTggOC4wNTkgMTggMTgiLz48cGF0aCBzdHJva2U9IiMyODU5YzUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTMyIDIxYTggOCAwIDEgMS0xNiAwYTggOCAwIDAgMSAxNiAwIi8+PC9nPjwvc3ZnPg==",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [30, 31],
	iconAnchor: [12, 41],
});

const destinationIcon = L.icon({
	iconUrl:
		"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjMiPjxwYXRoIGZpbGw9IiMxNkEzNEEiIGQ9Ik00MiAyMWMwIDEyLjkxOS0xMy4zNSAyMi4xMjgtMTcuMDU2IDI0LjQzNmExLjc3IDEuNzcgMCAwIDEtMS44ODggMEMxOS4zNTEgNDMuMTI4IDYgMzMuOTE5IDYgMjFjMC05Ljk0MSA4LjA1OS0xOCAxOC0xOHMxOCA4LjA1OSAxOCAxOCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMiAyMWE4IDggMCAxIDEtMTYgMGE4IDggMCAwIDEgMTYgMCIvPjxwYXRoIHN0cm9rZT0iIzE0NTMyRCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNDIgMjFjMCAxMi45MTktMTMuMzUgMjIuMTI4LTE3LjA1NiAyNC40MzZhMS43NyAxLjc3IDAgMCAxLTEuODg4IDBDMTkuMzUxIDQzLjEyOCA2IDMzLjkxOSA2IDIxYzAtOS45NDEgOC4wNTktMTggMTgtMThzMTggOC4wNTkgMTggMTgiLz48cGF0aCBzdHJva2U9IiMxNDUzMkQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTMyIDIxYTggOCAwIDEgMS0xNiAwYTggOCAwIDAgMSAxNiAwIi8+PC9nPjwvc3ZnPg==",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [30, 31],
	iconAnchor: [12, 41],
});

const transferIcon = L.icon({
	iconUrl:
		"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48Y2lyY2xlIGN4PSIyNCIgY3k9IjI0IiByPSIyMCIgZmlsbD0iI0Y1OUIwMCIgc3Ryb2tlPSIjQzI1NjA5IiBzdHJva2Utd2lkdGg9IjMiLz48cGF0aCBkPSJNMTggMjRIMzAiIHN0cm9rZT0iI0MyNTYwOSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHBhdGggZD0iTTI0IDE4TDMwIDI0TDI0IDMwIiBzdHJva2U9IiNDMjU2MDkiIHN0cm9rZS13aWR0aD0iNCIvPjwvc3ZnPg==",
	iconSize: [36, 36],
	iconAnchor: [18, 18],
});

interface BusMapProps {
	departure?: [number, number];
	destination?: [number, number];
	transferStop?: [number, number];
	routeType?: "direct" | "connecting";
}

function MapController({
	departure,
	destination,
	transferStop,
}: {
	departure?: [number, number];
	destination?: [number, number];
	transferStop?: [number, number];
}) {
	const map = useMap();

	useEffect(() => {
		const points: [number, number][] = [];
		if (departure) points.push(departure);
		if (transferStop) points.push(transferStop);
		if (destination) points.push(destination);

		if (points.length > 1) {
			map.fitBounds(L.latLngBounds(points), {
				padding: [60, 60],
				animate: true,
			});
		} else if (departure) {
			map.setView(departure, 14, { animate: true });
		} else if (destination) {
			map.setView(destination, 14, { animate: true });
		}
	}, [departure, destination, transferStop, map]);

	return null;
}

export default function BusMap({
	departure,
	destination,
	transferStop,
	routeType = "direct",
}: BusMapProps) {
	const [route1, setRoute1] = useState<[number, number][]>([]);
	const [route2, setRoute2] = useState<[number, number][]>([]);

	useEffect(() => {
		if (!departure || !destination) {
			setRoute1([]);
			setRoute2([]);
			return;
		}

		const fetchRoute = async (
			start: [number, number],
			end: [number, number],
		) => {
			try {
				const response = await fetch(
					`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
				);
				const data = await response.json();
				if (data?.routes?.[0]) {
					return data.routes[0].geometry.coordinates.map(
						(coord: [number, number]) =>
							[coord[1], coord[0]] as [number, number],
					);
				}
			} catch (error) {
				console.error("Routing error:", error);
			}
			return [];
		};

		const loadRoutes = async () => {
			if (routeType === "connecting" && transferStop) {
				const r1 = await fetchRoute(departure, transferStop);
				const r2 = await fetchRoute(transferStop, destination);
				setRoute1(r1);
				setRoute2(r2);
			} else {
				const fullRoute = await fetchRoute(departure, destination);
				setRoute1(fullRoute);
				setRoute2([]);
			}
		};

		loadRoutes();
	}, [departure, destination, transferStop, routeType]);

	return (
		<MapContainer
			center={departure ?? destination ?? [23.8103, 90.4125]}
			zoom={13}
			className="h-full w-full"
			zoomControl={false}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<MapController
				departure={departure}
				destination={destination}
				transferStop={transferStop}
			/>

			{departure && <Marker position={departure} icon={departureIcon} />}
			{destination && <Marker position={destination} icon={destinationIcon} />}
			{transferStop && <Marker position={transferStop} icon={transferIcon} />}

			{route1.length > 0 && (
				<Polyline
					positions={route1}
					color="#3b82f6"
					weight={6}
					opacity={0.85}
				/>
			)}
			{route2.length > 0 && (
				<Polyline
					positions={route2}
					color="#f59e0b"
					weight={6}
					opacity={0.85}
				/>
			)}
		</MapContainer>
	);
}
