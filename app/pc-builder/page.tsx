'use client';

import Image from 'next/image';
import { 
  Gamepad2, 
  Clapperboard, 
  Code2, 
  Briefcase, 
  Cpu, 
  Monitor, 
  Database, 
  ChevronRight, 
  Minus, 
  Plus, 
  LayoutGrid, 
  Rocket,
  HardDrive,
  MemoryStick
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USAGE_OPTIONS = [
  { id: 'Gaming', icon: Gamepad2, description: 'Triple-A titles and competitive play.' },
  { id: 'Content Creation', icon: Clapperboard, description: 'Video editing, 3D rendering, design.' },
  { id: 'Development', icon: Code2, description: 'Coding, VMs, and data processing.' },
  { id: 'Office & Web', icon: Briefcase, description: 'Browsing, Excel, and streaming.' },
];

const SOFTWARE_OPTIONS = [
  'Chrome / Edge', 'Adobe Premiere', 'Visual Studio Code', 'Discord', 'AutoCAD', 'Microsoft Excel'
];

const STORAGE_OPTIONS = [
  { id: 'Light', description: 'Mostly cloud docs' },
  { id: 'Medium', description: 'Few big games' },
  { id: 'Heavy', description: 'Raw 4K video' },
];

export default function SmartPCSuggester() {
  const [formData, setFormData] = useState({
    mainUsage: 'Gaming',
    browserTabs: 20,
    software: ['Chrome / Edge', 'Visual Studio Code'],
    storageNeeds: 'Medium',
  });

  const toggleSoftware = (item: string) => {
    setFormData(prev => ({
      ...prev,
      software: prev.software.includes(item)
        ? prev.software.filter(s => s !== item)
        : [...prev.software, item]
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Home</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-medium">Smart PC Suggester</span>
        </nav>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Smart PC Suggester</h1>
        <p className="text-lg text-slate-600">Answer a few simple questions and we&apos;ll design your perfect build.</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="space-y-8">
          {/* Progress Bar Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-slate-900">Building your profile...</h2>
              <span className="text-sm font-medium text-blue-600">Step 2 of 4</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '40%' }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </section>

          {/* Main Usage Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Rocket className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">What is the main thing you&apos;ll do on this PC?</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {USAGE_OPTIONS.map((option) => (
                <button
									type="button"
                  key={option.id}
                  onClick={() => setFormData(prev => ({ ...prev, mainUsage: option.id }))}
                  className={cn(
                    "flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200",
                    formData.mainUsage === option.id 
                      ? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50" 
                      : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-xl transition-colors",
                    formData.mainUsage === option.id ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    <option.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{option.id}</span>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        formData.mainUsage === option.id ? "border-blue-500 bg-blue-500" : "border-slate-200"
                      )}>
                        {formData.mainUsage === option.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Workload Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-lg">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Help us understand your workload</h2>
            </div>

            <div className="space-y-10">
              {/* Browser Tabs */}
              <div>
                <div className="block text-sm font-semibold text-slate-700 mb-4">How many browser tabs do you usually have open?</div>
                <div className="bg-slate-50/50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                  <button 
										type="button"
                    onClick={() => setFormData(prev => ({ ...prev, browserTabs: Math.max(0, prev.browserTabs - 5) }))}
                    className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Minus className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="text-center">
                    <span className="text-2xl font-black text-blue-600">{formData.browserTabs}+</span>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">Tabs</p>
                  </div>
                  <button 
										type="button"
                    onClick={() => setFormData(prev => ({ ...prev, browserTabs: prev.browserTabs + 5 }))}
                    className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Software Selection */}
              <div>
                <div className="block text-sm font-semibold text-slate-700 mb-4">Which software will you use most? (Select all that apply)</div>
                <div className="flex flex-wrap gap-3">
                  {SOFTWARE_OPTIONS.map((item) => (
                    <button
											type="button"
                      key={item}
                      onClick={() => toggleSoftware(item)}
                      className={cn(
                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
                        formData.software.includes(item)
                          ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Needs */}
              <div>
                <div  className="block text-sm font-semibold text-slate-700 mb-4">Storage Needs (Photos, Videos, Games)</div>
                <div className="grid grid-cols-3 gap-4">
                  {STORAGE_OPTIONS.map((option) => (
                    <button
											type="button"
                      key={option.id}
                      onClick={() => setFormData(prev => ({ ...prev, storageNeeds: option.id }))}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center transition-all duration-200",
                        formData.storageNeeds === option.id
                          ? "border-blue-500 bg-blue-50/30 ring-4 ring-blue-50"
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                      )}
                    >
                      <span className="block font-bold text-slate-900 mb-1">{option.id}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <button type='button' className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Back
            </button>
            <button type='submit' className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 group">
              Next Step
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-8">
          {/* Current Suggestion Card */}
          <div className="bg-[#0F172A] rounded-2xl p-6 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Current Suggestion</p>
              <h3 className="text-2xl font-black mb-6">Hardcore Gamer</h3>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <Cpu className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Recommended CPU</p>
                    <p className="text-sm font-bold">Intel Core i7-13700K</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <Monitor className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Recommended GPU</p>
                    <p className="text-sm font-bold">NVIDIA RTX 4070 Ti</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
                    <Database className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">RAM / Storage</p>
                    <p className="text-sm font-bold">32GB DDR5 + 1TB SSD</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 text-[11px] leading-relaxed text-white/60 italic">
                &quot;Based on your 20+ tabs and gaming focus, we&apos;ve prioritized high-speed RAM and a powerful graphics card.&quot;
              </div>
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="aspect-[4/3] relative bg-slate-100">
              <Image 
                src="https://picsum.photos/seed/pc-setup/400/300" 
                alt="PC Setup" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            <div className="p-6 pt-0 text-center relative z-10 -mt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Estimated Budget</p>
              <p className="text-2xl font-black text-blue-600 mb-6">$1,800 - $2,200</p>
              <button type='button' className="w-full py-3 bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                View Price Breakdown
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* Final Recommendation Section */}
      <section className="bg-white border-t border-slate-200 py-20 mt-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
            Final Recommendation
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">The &quot;Apex Pro&quot; Build</h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg leading-relaxed mb-12">
            This configuration is tailor-made for high-frame-rate gaming at 1440p while handling heavy multitasking and software development with ease.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { label: 'Processor', title: 'Core i7-13700K', desc: 'Perfect for heavy multitasking and CPU-intensive games.', icon: Cpu },
              { label: 'Graphics', title: 'RTX 4070 Ti', desc: 'Unmatched 1440p performance with ray-tracing capabilities.', icon: Monitor },
              { label: 'Memory', title: '32GB DDR5 6000MHz', desc: 'Future-proof capacity for Chrome tabs and 4K editing.', icon: MemoryStick },
              { label: 'Storage', title: '2TB Gen4 NVMe SSD', desc: 'Blazing fast load times and plenty of game storage.', icon: HardDrive },
            ].map((spec) => (
              <div key={spec.label} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors group">
                <div className="p-3 bg-white rounded-xl border border-slate-200 w-fit mb-4 group-hover:bg-blue-500 group-hover:border-blue-500 transition-colors">
                  <spec.icon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">{spec.label}</p>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{spec.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
