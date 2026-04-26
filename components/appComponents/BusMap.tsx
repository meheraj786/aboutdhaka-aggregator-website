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

const icon = L.icon({
	iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48ZyBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjMiPjxwYXRoIGZpbGw9IiMxNDVERkMiIGQ9Ik00MiAyMWMwIDEyLjkxOS0xMy4zNSAyMi4xMjgtMTcuMDU2IDI0LjQzNmExLjc3IDEuNzcgMCAwIDEtMS44ODggMEMxOS4zNTEgNDMuMTI4IDYgMzMuOTE5IDYgMjFjMC05Ljk0MSA4LjA1OS0xOCAxOC0xOHMxOCA4LjA1OSAxOCAxOCIvPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0zMiAyMWE4IDggMCAxIDEtMTYgMGE4IDggMCAwIDEgMTYgMCIvPjxwYXRoIHN0cm9rZT0iIzI4NTljNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNDIgMjFjMCAxMi45MTktMTMuMzUgMjIuMTI4LTE3LjA1NiAyNC40MzZhMS43NyAxLjc3IDAgMCAxLTEuODg4IDBDMTkuMzUxIDQzLjEyOCA2IDMzLjkxOSA2IDIxYzAtOS45NDEgOC4wNTktMTggMTgtMThzMTggOC4wNTkgMTggMTgiLz48cGF0aCBzdHJva2U9IiMyODU5YzUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZD0iTTMyIDIxYTggOCAwIDEgMS0xNiAwYTggOCAwIDAgMSAxNiAwIi8+PC9nPjwvc3ZnPg==",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [30, 31],
	iconAnchor: [12, 41],
});

interface BusMapProps {
	departure?: [number, number];
	destination?: [number, number];
}

function MapController({
	departure,
	routePoints,
}: {
	departure?: [number, number];
	destination?: [number, number];
	routePoints: [number, number][];
}) {
	const map = useMap();

	useEffect(() => {
		if (routePoints.length > 0) {
			map.fitBounds(L.polyline(routePoints).getBounds(), { padding: [50, 50] });
		} else if (departure) {
			map.setView(departure, 14);
		}
	}, [departure, routePoints, map]);

	return null;
}

export default function BusMap({ departure, destination }: BusMapProps) {
	const [routePoints, setRoutePoints] = useState<[number, number][]>([]);

	useEffect(() => {
		if (departure && destination) {
			const fetchRoute = async () => {
				try {
					const response = await fetch(
						`https://router.project-osrm.org/route/v1/driving/${departure[1]},${departure[0]};${destination[1]},${destination[0]}?overview=full&geometries=geojson`,
					);
					const data = await response.json();
					if (data?.routes?.[0]) {
						const coords = data.routes[0]?.geometry?.coordinates?.map(
							(coord: [number, number]) =>
								[coord[1], coord[0]] as [number, number],
						);
						setRoutePoints(coords);
					}
				} catch (error) {
					console.error("Routing error:", error);
				}
			};
			fetchRoute();
		} else {
			setRoutePoints([]);
		}
	}, [departure, destination]);

	return (
		<MapContainer
			center={[23.8103, 90.4125]}
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
				routePoints={routePoints}
			/>
			{departure && <Marker position={departure} icon={icon} />}
			{destination && <Marker position={destination} icon={icon} />}
			{routePoints.length > 0 && (
				<Polyline
					positions={routePoints}
					color="#3b82f6"
					weight={5}
					opacity={0.7}
				/>
			)}
		</MapContainer>
	);
}
