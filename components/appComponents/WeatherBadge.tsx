'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Sun, Cloud, CloudRain, Zap, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const getBadgeIcon = (code: number) => {
  if (code === 0 || code === 1) return <Sun className="w-5 h-5 text-amber-500 fill-amber-500/20" />;
  if (code === 2 || code === 3) return <Cloud className="w-5 h-5 text-blue-400 fill-blue-400/20" />;
  if (code >= 51 && code <= 82) return <CloudRain className="w-5 h-5 text-sky-500" />;
  if (code >= 95) return <Zap className="w-5 h-5 text-purple-500 fill-purple-500/20" />;
  return <Cloud className="w-5 h-5 text-slate-400" />;
};

export default function WeatherBadge() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['weather-badge'],
    queryFn: async () => {
      const res = await axios.get(
        'https://api.open-meteo.com/v1/forecast?latitude=23.81&longitude=90.41&current=temperature_2m,weather_code&timezone=Asia/Dhaka'
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // If there's an error, we hide the badge to keep the UI clean
  if (error) return null;

  return (
    <Link 
      href="/weather" 
      aria-label="View full weather forecast"
      className="fixed bottom-10 left-10 z-[100] group"
    >
      <div className="relative flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[22px] rounded-bl-none transition-all duration-500 hover:translate-y-[-5px] hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] active:scale-95">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-[22px] rounded-bl-none bg-blue-400/0 group-hover:bg-blue-400/5 transition-colors duration-500" />

        {/* Weather Icon Box */}
        <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 group-hover:rotate-[15deg] transition-transform duration-500">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          ) : (
            getBadgeIcon(data?.current?.weather_code)
          )}
        </div>

        {/* Text Details */}
        <div className="flex flex-col pr-1">
          {isLoading ? (
            <div className="space-y-1">
              <div className="h-4 w-6 bg-slate-200 animate-pulse rounded" />
              <div className="h-2 w-10 bg-slate-100 animate-pulse rounded" />
            </div>
          ) : (
            <>
              <span className="text-lg font-bold text-slate-800 leading-none">
                {Math.round(data?.current?.temperature_2m || 0)}°
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                Dhaka
              </span>
            </>
          )}
        </div>

        {/* Hidden Reveal Arrow */}
        <div className="w-0 overflow-hidden group-hover:w-5 transition-all duration-500 opacity-0 group-hover:opacity-100 flex items-center">
          <ArrowRight className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      {/* Decorative "Waterdrop" Tail Shadow */}
      <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-white/40 blur-sm rounded-full -z-10 group-hover:opacity-0 transition-opacity" />
    </Link>
  );
}