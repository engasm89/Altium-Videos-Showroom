import React from 'react';
import { 
  Compass, 
  Users, 
  Search, 
  Cpu, 
  Cloud, 
  ArrowRight, 
  CheckCircle, 
  Zap,
  Sparkles,
  Layers,
  CircuitBoard
} from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterProduct: (product: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onFilterProduct
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800 pt-10 pb-16">
      {/* Background Subtle Circuit Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Proof Badge */}
        <div className="inline-flex items-center space-x-2 bg-blue-950/80 border border-blue-800/80 px-3 py-1 rounded-full text-xs font-mono text-blue-300 mb-6 shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Educational Engineering Team Catalog</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400 font-semibold">200+ Practical Tutorials</span>
        </div>

        {/* Headline */}
        <div className="max-w-4xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Master Modern Electronics <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Product Development
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Follow structured, project-based learning paths covering PCB design, component libraries, interactive routing, manufacturing release, cross-team collaboration, AI requirements, BOM supply-chain risk, and multidisciplinary hardware engineering.
          </p>
        </div>

        {/* Global Search Box in Hero */}
        <div className="mt-8 max-w-2xl">
          <div className="relative flex items-center shadow-2xl">
            <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 201 tutorials: DRC, ESP32, ActiveBOM, SolidWorks, Gerber..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveTab('catalog');
              }}
              className="w-full bg-slate-900 border-2 border-slate-700/90 rounded-xl pl-12 pr-28 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
            />
            <button
              onClick={() => setActiveTab('catalog')}
              className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold tracking-wide transition-colors"
            >
              Search Catalog
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400 font-mono flex items-center space-x-2">
            <span>Popular:</span>
            <button onClick={() => { setSearchQuery('DRC'); setActiveTab('catalog'); }} className="hover:text-blue-400 underline">DRC Check</button>
            <button onClick={() => { setSearchQuery('ESP32'); setActiveTab('catalog'); }} className="hover:text-blue-400 underline">ESP32 RF</button>
            <button onClick={() => { setSearchQuery('ActiveBOM'); setActiveTab('catalog'); }} className="hover:text-blue-400 underline">ActiveBOM</button>
            <button onClick={() => { setSearchQuery('SolidWorks'); setActiveTab('catalog'); }} className="hover:text-blue-400 underline">SolidWorks ECAD-MCAD</button>
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setActiveTab('paths')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-900/30 flex items-center space-x-2 transition-all"
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>Start a Learning Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Users className="w-4 h-4 text-purple-400" />
            <span>Browse by Engineering Role</span>
          </button>

          <button
            onClick={() => {
              onFilterProduct('Altium Designer');
              setActiveTab('catalog');
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-900/80 font-mono text-xs rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Altium Designer (96)</span>
          </button>

          <button
            onClick={() => {
              onFilterProduct('Altium Develop');
              setActiveTab('catalog');
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-900/80 font-mono text-xs rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Altium Develop (105)</span>
          </button>
        </div>

        {/* Platform Proof Metrics Banner */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-8 text-slate-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-950 rounded-lg text-blue-400 border border-blue-800">
              <CircuitBoard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">201</div>
              <div className="text-xs text-slate-400">Recovered Tutorials</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 rounded-lg text-emerald-400 border border-emerald-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">10</div>
              <div className="text-xs text-slate-400">Curated Learning Paths</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-950 rounded-lg text-purple-400 border border-purple-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">30+</div>
              <div className="text-xs text-slate-400">Hardware Projects</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">6</div>
              <div className="text-xs text-slate-400">Engineering Personas</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
