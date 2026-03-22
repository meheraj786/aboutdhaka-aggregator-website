'use client';
import { Search } from "lucide-react";
import Image from "next/image";
import img from "../../public/heroImg.png";
import Typewriter from "typewriter-effect";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative py-30 px-6 flex flex-col items-center text-center min-h-[600px] justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={img}
          alt="Dhaka Cityscape"
          fill
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[0.9]">
          Discover the Best of <span className="text-blue-600"> <Typewriter
  options={{
    strings: ['Dhaka!'],
    autoStart: true,
    loop: true,


  }}
/></span>
        </h1>

        <p className="text-slate-600 text-lg md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
          Your comprehensive guide to exploring the city&apos;s hidden gems,
          essential services, and premium lifestyles.
        </p>

        <div className="w-full max-w-3xl mx-auto relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search places, hospitals, restaurants in Dhaka..."
            className="w-full py-6 pl-16 pr-40 bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-blue-500/10 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-700 text-lg font-medium"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            Search
          </button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-blue-500 font-bold text-sm uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full" />
            500+ Hospitals
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            1200+ Restaurants
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-500 rounded-full" />
            300+ Hotels
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
