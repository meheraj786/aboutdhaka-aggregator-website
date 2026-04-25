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
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
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
