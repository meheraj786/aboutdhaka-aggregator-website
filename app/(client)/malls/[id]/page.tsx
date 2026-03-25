'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Star,
  Clock,
  Phone,
  Share2,
  Bookmark,
  Navigation,
  CheckCircle2,
  ChevronLeft,
  ShoppingBag,
  Store,
  Info,
  ArrowRight,
} from 'lucide-react';
import { SHOPPING_MALLS } from '@/lib/data';
import { motion } from 'motion/react';

export default function ShoppingMallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const mall = SHOPPING_MALLS.find((m) => m.id === id);
  const [activeTab, setActiveTab] = useState('Overview');

  if (!mall) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800">Mall Not Found</h1>
          <p className="text-slate-500 mb-6">The shopping mall you are looking for doesn&apos;t exist.</p>
          <Link
            href="/shopping-malls"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Malls
          </Link>
        </div>
      </div>
    );
  }

  const nearbyMalls = SHOPPING_MALLS.filter((m) => m.id !== id && m.area === mall.area).slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={mall.image}
          alt={mall.name}
          fill
          className="object-cover"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-24 left-4 sm:left-8">
          <Link
            href="/shopping-malls"
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 transition-all border border-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Malls
          </Link>
        </div>

        <div className="absolute bottom-8 left-4 right-4 sm:left-8 sm:right-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                  Shopping Mall
                </span>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/20">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {mall.rating} ({mall.reviews.toLocaleString()} Reviews)
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                {mall.name}
              </h1>
              <div className="flex items-center gap-2 text-white/80 text-lg">
                <MapPin className="w-5 h-5 text-blue-400" />
                {mall.location}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button type="button" className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all border border-white/20">
                <Share2 className="w-5 h-5" />
              </button>
              <button type="button" className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all border border-white/20">
                <Bookmark className="w-5 h-5" />
              </button>
              <button type="button" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
                <Navigation className="w-5 h-5" />
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200 overflow-x-auto pb-1">
              {['Overview', 'Shops', 'Gallery', 'Reviews'].map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                    activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {activeTab === 'Overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <Info className="w-6 h-6 text-blue-600" />
                    About the Mall
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    {mall.longDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      Facilities
                    </h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {mall.facilities.map((facility) => (
                        <li key={facility} className="flex items-center gap-2 text-slate-600 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          {facility}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Store className="w-5 h-5 text-blue-600" />
                      Popular Shops
                    </h3>
                    <ul className="grid grid-cols-1 gap-3">
                      {mall.shops.map((shop) => (
                        <li key={shop} className="flex items-center gap-2 text-slate-600 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          {shop}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Shops' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {mall.shops.map((shop) => (
                  <div
                    key={shop}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-200 hover:shadow-md transition-all text-center"
                  >
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-slate-800">{shop}</h4>
                    <p className="text-xs text-slate-400 mt-1">Clothing & Fashion</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'Gallery' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {mall.gallery.map((img, idx) => (
                  <div
                    key={img}
                    className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`${mall.name} gallery ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all" />
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Quick Info Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <h3 className="text-xl font-bold">Quick Information</h3>
                <p className="text-slate-400 text-sm mt-1">Everything you need to know</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Opening Hours
                    </p>
                    <p className="text-slate-700 font-medium">{mall.openingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Contact Number
                    </p>
                    <p className="text-slate-700 font-medium">{mall.contact}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Area
                    </p>
                    <p className="text-slate-700 font-medium">{mall.area}, Dhaka</p>
                  </div>
                </div>

                <button type="button" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                  Book a Water Taxi
                </button>
              </div>
            </div>

            {/* Nearby Malls */}
            {nearbyMalls.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800">Nearby Malls</h3>
                <div className="space-y-4">
                  {nearbyMalls.map((m) => (
                    <Link
                      key={m.id}
                      href={`/shopping-malls/${m.id}`}
                      className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={m.image}
                          alt={m.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                          {m.name}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {m.rating} • {m.area}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
