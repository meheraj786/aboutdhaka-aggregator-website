"use client";

import {
  AlertTriangle,
  Bus as BusIcon,
  ChevronDown,
  Clock,
  Info,
  Loader2,
  Map as MapIcon,
  MapPin,
  Navigation,
  Search,
  XCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { IAreaPopulated } from "@/actions/area.action";
import type { IBusWithStops, IConnectingRoute } from "@/actions/bus.action";
import { useFetchAreas } from "@/hooks/useAreas";
import { useFindBusRoutes } from "@/hooks/useBus";
import { useFindNearestStop } from "@/hooks/useNearestStop";

const BusMap = dynamic(() => import("@/components/appComponents/BusMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
      <MapIcon className="w-8 h-8 text-slate-300" />
    </div>
  ),
});

function BusRouteContent() {
  const query = useSearchParams();
  const [departureAreaId, setDepartureAreaId] = useState<string>("");
  const [destinationAreaId, setDestinationAreaId] = useState<string>("");
  const [departureStopId, setDepartureStopId] = useState<string>("");
  const [destinationStopId, setDestinationStopId] = useState<string>("");
  const [searchParams, setSearchParams] = useState<{
    dep: string;
    dest: string;
  } | null>(null);
  const [nearestStopResolved, setNearestStopResolved] = useState(false);
  const autoSearchedRef = useRef(false);

  const { data: areaData = [] } = useFetchAreas();
  const areas: IAreaPopulated[] = areaData;

  const urlLat = query.get("lat");
  const urlLng = query.get("lng");
  const hasLatLng = Boolean(urlLat && urlLng);

  const { data: nearestStop, isLoading: isResolvingNearest } =
    useFindNearestStop(
      hasLatLng ? Number(urlLat) : undefined,
      hasLatLng ? Number(urlLng) : undefined,
    );

  const destLat = query.get("destLat");
  const destLng = query.get("destLng");
  const hasDestLatLng = Boolean(destLat && destLng);

  const { data: nearestDestStop, isLoading: isResolvingDestNearest } =
    useFindNearestStop(
      hasDestLatLng ? Number(destLat) : undefined,
      hasDestLatLng ? Number(destLng) : undefined,
    );

  // Handle manual URL params (depS, destS etc.)
  useEffect(() => {
    const depA = query.get("depA");
    const depS = query.get("depS");
    const destA = query.get("destA");
    const destS = query.get("destS");

    if (depA) setDepartureAreaId(depA);
    if (destA) setDestinationAreaId(destA);
    if (depS) setDepartureStopId(depS);
    if (destS) setDestinationStopId(destS);

    if (depS && destS) {
      setSearchParams({ dep: depS, dest: destS });
    }
  }, [query]);

  // Auto-fill departure from GPS nearest stop
  useEffect(() => {
    if (nearestStop && !nearestStopResolved && !query.get("depS")) {
      setDepartureAreaId(nearestStop.areaId);
      setDepartureStopId(nearestStop.stopId);
      setNearestStopResolved(true);
    }
  }, [nearestStop, nearestStopResolved, query]);

  // Auto-fill destination from hospital coordinates
  useEffect(() => {
    if (nearestDestStop && !query.get("destS")) {
      setDestinationAreaId(nearestDestStop.areaId);
      setDestinationStopId(nearestDestStop.stopId);
    }
  }, [nearestDestStop, query]);

  // Auto-search once both stops are resolved from hospital page redirect
  useEffect(() => {
    if (autoSearchedRef.current || isResolvingNearest || isResolvingDestNearest)
      return;
    if (!hasLatLng && !hasDestLatLng) return; // only auto-search when coming from hospital page

    const depId = nearestStop?.stopId || query.get("depS");
    const destId = nearestDestStop?.stopId || query.get("destS");

    if (depId && destId && depId !== destId) {
      autoSearchedRef.current = true;
      setSearchParams({ dep: depId, dest: destId });
    }
  }, [
    nearestStop,
    nearestDestStop,
    isResolvingNearest,
    isResolvingDestNearest,
    hasLatLng,
    hasDestLatLng,
    query,
  ]);

  const { data: routeResults, isLoading: isSearching } = useFindBusRoutes(
    searchParams?.dep || "",
    searchParams?.dest || "",
  );

  const selectedDepartureArea = useMemo(
    () => areas.find((a) => a._id === departureAreaId),
    [areas, departureAreaId],
  );
  const selectedDestinationArea = useMemo(
    () => areas.find((a) => a._id === destinationAreaId),
    [areas, destinationAreaId],
  );

  const departureCoords = useMemo(() => {
    const stopData = selectedDepartureArea?.stops?.find(
      (s) => s?.stop?._id === departureStopId,
    );
    if (stopData?.stop?.location?.coordinates) {
      const [lng, lat] = stopData.stop.location.coordinates;
      return [lat, lng] as [number, number];
    }
    return undefined;
  }, [selectedDepartureArea, departureStopId]);

  const destinationCoords = useMemo(() => {
    const stopData = selectedDestinationArea?.stops.find(
      (s) => s.stop?._id === destinationStopId,
    );
    if (stopData?.stop?.location?.coordinates) {
      const [lng, lat] = stopData.stop.location.coordinates;
      return [lat, lng] as [number, number];
    }
    return undefined;
  }, [selectedDestinationArea, destinationStopId]);

  const handleSearch = () => {
    if (!departureStopId || !destinationStopId) return;
    if (departureStopId === destinationStopId) return;
    setSearchParams({ dep: departureStopId, dest: destinationStopId });
  };

  const isResolvingAny = isResolvingNearest || isResolvingDestNearest;
  const isSameStop =
    departureStopId &&
    destinationStopId &&
    departureStopId === destinationStopId;
  const hasSearched = searchParams !== null;
  const noResults = hasSearched && !isSearching && !routeResults?.data?.length;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <main className="grow py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Find Your Bus Route
              </h1>
              <p className="text-slate-500 text-lg">
                Discover direct and connecting bus services across Dhaka city.
              </p>
            </div>
          </div>

          {/* Banners */}
          {isResolvingAny && (
            <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 text-emerald-700 text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
              Finding nearest bus stops from your location...
            </div>
          )}

          {nearestStopResolved && !isResolvingAny && (
            <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 text-emerald-700 text-sm font-medium">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              Nearest bus stop auto-selected from your GPS location. You can
              change it below.
            </div>
          )}

          {/* Same stop warning */}
          {isSameStop && (
            <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 text-amber-700 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Your departure and destination are the same stop. Please select
              different stops.
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              {/* Departure */}
              <div className="md:col-span-4 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="dep-area"
                    className="block text-sm font-bold text-slate-900 ml-1"
                  >
                    Departure Area
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      id="dep-area"
                      value={departureAreaId}
                      onChange={(e) => {
                        setDepartureAreaId(e.target.value);
                        setDepartureStopId("");
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Area</option>
                      {areas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="dep-stop"
                    className="block text-sm font-bold text-slate-900 ml-1"
                  >
                    Departure Bus-Stop
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      id="dep-stop"
                      disabled={!departureAreaId}
                      value={departureStopId}
                      onChange={(e) => setDepartureStopId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 outline-none disabled:opacity-50"
                    >
                      <option value="">Select Bus Stop</option>
                      {selectedDepartureArea?.stops?.map((item) => (
                        <option key={item.stop?._id} value={item.stop?._id}>
                          {item.stop?.stopName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="md:col-span-4 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="dest-area"
                    className="block text-sm font-bold text-slate-900 ml-1"
                  >
                    Destination Area
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      id="dest-area"
                      value={destinationAreaId}
                      onChange={(e) => {
                        setDestinationAreaId(e.target.value);
                        setDestinationStopId("");
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="">Select Area</option>
                      {areas.map((area) => (
                        <option key={area._id} value={area._id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="dest-stop"
                    className="block text-sm font-bold text-slate-900 ml-1"
                  >
                    Destination Bus-Stop
                  </label>
                  <div className="relative">
                    <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <select
                      id="dest-stop"
                      disabled={!destinationAreaId}
                      value={destinationStopId}
                      onChange={(e) => setDestinationStopId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-10 appearance-none font-semibold text-slate-700 outline-none disabled:opacity-50"
                    >
                      <option value="">Select Bus Stop</option>
                      {selectedDestinationArea?.stops?.map((item) => (
                        <option key={item.stop?._id} value={item.stop?._id}>
                          {item.stop?.stopName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-4">
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={
                    !departureStopId ||
                    !destinationStopId ||
                    isSearching ||
                    !!isSameStop
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 h-[60px] md:h-[148px]"
                >
                  <Search className="w-6 h-6" />
                  {isSearching ? "Finding..." : "Search Routes"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {routeResults?.type === "direct"
                    ? "Direct Buses"
                    : routeResults?.type === "connecting"
                      ? "Connecting Routes"
                      : "Available Routes"}
                  {routeResults?.data?.length
                    ? ` (${routeResults.data.length})`
                    : ""}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Initial empty state */}
                {!hasSearched && !isSearching && !isResolvingAny && (
                  <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-[2rem]">
                    <BusIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">
                      {departureStopId && destinationStopId
                        ? "Press Search Routes to find available buses."
                        : "Select stops and search to see available buses."}
                    </p>
                  </div>
                )}

                {/* Loading state */}
                {(isSearching || isResolvingAny) && (
                  <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[2rem]">
                    <Loader2 className="w-10 h-10 text-blue-400 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-500 font-medium">
                      {isResolvingAny
                        ? "Finding nearest stops..."
                        : "Searching for bus routes..."}
                    </p>
                  </div>
                )}

                {/* No results */}
                {noResults && !isSameStop && (
                  <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-[2rem]">
                    <XCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-700 font-bold text-lg mb-2">
                      No buses found
                    </p>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                      No direct or connecting bus routes were found between
                      these two stops. Try selecting nearby stops.
                    </p>
                  </div>
                )}

                {/* Direct routes */}
                {!isSearching &&
                  routeResults?.type === "direct" &&
                  (routeResults.data as IBusWithStops[]).map((bus) => (
                    <div
                      key={bus._id}
                      className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <BusIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {bus.busName}
                            </h3>
                            <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                              <Clock className="w-3.5 h-3.5" /> Direct Service
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-600">
                          DIRECT ROUTE
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mb-8">
                        {bus.stops.map((s, i) => (
                          <React.Fragment key={s._id}>
                            <span
                              className={`px-4 py-2 rounded-xl text-xs font-bold ${
                                s._id === departureStopId ||
                                s._id === destinationStopId
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-50 text-slate-600"
                              }`}
                            >
                              {s.stopName}
                            </span>
                            {i < bus.stops.length - 1 && (
                              <div className="w-3 h-px bg-slate-200" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
                      >
                        <MapIcon className="w-4 h-4" /> View Full Route
                      </button>
                    </div>
                  ))}

                {/* Connecting routes */}
                {!isSearching &&
                  routeResults?.type === "connecting" &&
                  (routeResults.data as IConnectingRoute[]).map(
                    (route, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                              <Navigation className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">
                                Change at {route.transferAt.stopName}
                              </h3>
                              <p className="text-sm text-slate-500">
                                Requires 1 transfer
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4 relative before:absolute before:left-[19px] before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-100">
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                              1
                            </div>
                            <div className="flex-grow p-4 bg-slate-50 rounded-2xl">
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                                First Leg
                              </p>
                              <p className="text-slate-900 font-bold">
                                Take{" "}
                                <span className="text-blue-600">
                                  {route.bus1.name}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                              2
                            </div>
                            <div className="flex-grow p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
                              <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">
                                Transfer Point
                              </p>
                              <p className="text-slate-900 font-bold">
                                Switch at{" "}
                                <span className="text-orange-600">
                                  {route.transferAt.stopName}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs ring-4 ring-white">
                              3
                            </div>
                            <div className="flex-grow p-4 bg-slate-50 rounded-2xl">
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                                Final Leg
                              </p>
                              <p className="text-slate-900 font-bold">
                                Board{" "}
                                <span className="text-emerald-600">
                                  {route.bus2.name}
                                </span>{" "}
                                to destination
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">
                Route Preview
              </h2>

              <div className="relative bg-white rounded-[2.5rem] h-[550px] overflow-hidden border border-slate-200 shadow-inner">
                <BusMap
                  departure={departureCoords}
                  destination={destinationCoords}
                  transferStop={
                    routeResults?.type === "connecting" &&
                    routeResults?.data?.length > 0
                      ? (() => {
                          const firstRoute = routeResults
                            .data[0] as IConnectingRoute;
                          const transfer = firstRoute.transferAt;
                          if (transfer?.location?.coordinates?.length === 2) {
                            const [lng, lat] = transfer.location.coordinates;
                            return [lat, lng] as [number, number];
                          }
                          return undefined;
                        })()
                      : undefined
                  }
                  routeType={routeResults?.type || "direct"}
                />
              </div>

              <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex gap-4">
                <Info className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  Map may not be 100% accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BusRoutePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusRouteContent />
    </Suspense>
  );
}
