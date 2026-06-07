'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { 
  CloudRain, Sun, Cloud, Zap, Droplet, 
  ThermometerSun, Wind, MapPin, Calendar, 
  Navigation, ArrowUp, ArrowDown 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    uv_index_max: number[];
  };
}

const getWeatherInfo = (code: number) => {
  const map: Record<number, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
    0: { icon: <Sun className="w-full h-full" />, label: 'Clear Sky', color: 'text-amber-500', bg: 'bg-amber-50' },
    1: { icon: <Sun className="w-full h-full" />, label: 'Mainly Clear', color: 'text-amber-400', bg: 'bg-amber-50' },
    2: { icon: <Cloud className="w-full h-full" />, label: 'Partly Cloudy', color: 'text-blue-400', bg: 'bg-blue-50' },
    3: { icon: <Cloud className="w-full h-full" />, label: 'Overcast', color: 'text-slate-500', bg: 'bg-slate-100' },
    45: { icon: <Cloud className="w-full h-full" />, label: 'Foggy', color: 'text-slate-400', bg: 'bg-slate-50' },
    51: { icon: <CloudRain className="w-full h-full" />, label: 'Drizzle', color: 'text-sky-500', bg: 'bg-sky-50' },
    61: { icon: <CloudRain className="w-full h-full" />, label: 'Rainy', color: 'text-blue-500', bg: 'bg-blue-50' },
    95: { icon: <Zap className="w-full h-full" />, label: 'Stormy', color: 'text-purple-500', bg: 'bg-purple-50' },
  };
  return map[code] || { icon: <Cloud className="w-full h-full" />, label: 'Cloudy', color: 'text-slate-500', bg: 'bg-slate-50' };
};

export default function WeatherPage() {
  const { data, isLoading, error } = useQuery<WeatherData>({
    queryKey: ['dhaka-weather'],
    queryFn: async () => {
      const res = await axios.get(
        'https://api.open-meteo.com/v1/forecast?latitude=23.81&longitude=90.41&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=Asia/Dhaka&forecast_days=7'
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">Syncing with the sky...</p>
    </div>
  );

  if (error) return <div className="p-10 text-red-500">Could not fetch weather. Please try again later.</div>;

  const today = data?.current;
  const todayInfo = getWeatherInfo(today?.weather_code || 0);
  const daily = data?.daily;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
              <Navigation className="w-6 h-6 text-blue-600 fill-blue-600/10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dhaka, Bangladesh</h1>
              <p className="text-slate-500 text-sm flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {format(new Date(), 'EEEE, dd MMMM yyyy')}
              </p>
            </div>
          </div>
          <Badge className="w-fit bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 px-4 py-1.5 rounded-full">
            Live Updates
          </Badge>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Hero Card */}
          <Card className="lg:col-span-2 overflow-hidden border-none shadow-2xl shadow-blue-100 rounded-[2.5rem] bg-white relative">
            <div className="absolute top-0 right-0 p-10 opacity-10 w-64 h-64">
              {todayInfo.icon}
            </div>
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                  <div className={`w-20 h-20 p-4 rounded-3xl ${todayInfo.bg} ${todayInfo.color} mb-6`}>
                    {todayInfo.icon}
                  </div>
                  <h2 className="text-8xl font-bold tracking-tighter text-slate-900">
                    {Math.round(today?.temperature_2m || 0)}°
                  </h2>
                  <p className="text-2xl font-semibold text-slate-400 mt-2">{todayInfo.label}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                  <WeatherMetric 
                    icon={<ThermometerSun className="text-orange-500" />} 
                    label="Feels like" 
                    value={`${Math.round(today?.apparent_temperature || 0)}°C`} 
                  />
                  <WeatherMetric 
                    icon={<Droplet className="text-blue-500" />} 
                    label="Humidity" 
                    value={`${today?.relative_humidity_2m}%`} 
                  />
                  <WeatherMetric 
                    icon={<Wind className="text-teal-500" />} 
                    label="Wind speed" 
                    value={`${today?.wind_speed_10m} km/h`} 
                  />
                  <WeatherMetric 
                    icon={<Sun className="text-amber-500" />} 
                    label="UV Index" 
                    value={`${daily?.uv_index_max[0]}`} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Section: Weekly Small Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold px-2">Next 7 Days</h3>
            <div className="space-y-3">
              {daily?.time.map((date, index) => {
                if (index === 0) return null;
                const info = getWeatherInfo(daily.weather_code[index]);
                return (
                  <div 
                    key={date} 
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-hover hover:border-blue-200"
                  >
                    <div className="w-10 text-sm font-semibold text-slate-400">
                      {format(new Date(date), 'EEE')}
                    </div>
                    <div className={`w-8 h-8 ${info.color}`}>
                      {info.icon}
                    </div>
                    <div className="flex items-center gap-2 w-20 justify-end">
                      <span className="text-sm font-bold">{Math.round(daily.temperature_2m_max[index])}°</span>
                      <span className="text-sm text-slate-300">{Math.round(daily.temperature_2m_min[index])}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Detailed Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
           {daily?.time.slice(0, 4).map((date, index) => {
             const info = getWeatherInfo(daily.weather_code[index]);
             return (
               <Card key={date + 'stat'} className="border-none shadow-sm rounded-[2rem] bg-white group hover:bg-blue-600 transition-all duration-300">
                 <CardContent className="p-6">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 group-hover:text-blue-100">
                     {index === 0 ? 'Today' : format(new Date(date), 'EEEE')}
                   </p>
                   <div className="flex items-center justify-between">
                     <div>
                       <div className="flex items-center gap-1 mb-1">
                         <ArrowUp className="w-3 h-3 text-rose-500 group-hover:text-white" />
                         <span className="text-xl font-bold group-hover:text-white">{Math.round(daily.temperature_2m_max[index])}°</span>
                       </div>
                       <div className="flex items-center gap-1">
                         <ArrowDown className="w-3 h-3 text-blue-500 group-hover:text-white" />
                         <span className="text-sm text-slate-400 group-hover:text-blue-200">{Math.round(daily.temperature_2m_min[index])}°</span>
                       </div>
                     </div>
                     <div className={`w-12 h-12 p-2 rounded-xl bg-slate-50 group-hover:bg-blue-500 ${info.color} group-hover:text-white`}>
                        {info.icon}
                     </div>
                   </div>
                 </CardContent>
               </Card>
             );
           })}
        </div>
      </div>
    </div>
  );
}

function WeatherMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}