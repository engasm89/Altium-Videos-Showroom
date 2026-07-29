import React from 'react';
import { 
  Compass, 
  Users, 
  Search, 
  Cpu, 
  Cloud, 
  ArrowRight, 
  Layers,
  CircuitBoard,
  Target,
  BarChart3,
  Shield
} from 'lucide-react';
import { catalogCounts } from '../data/catalog';
import { LEARNING_PATHS } from '../data/learningPaths';
import { HARDWARE_PROJECTS } from '../data/projects';
import { ENGINEERING_ROLES } from '../data/roles';
import { DESIGNER_TOPICS, DEVELOP_TOPICS, PRIMARY_PATH_LIMIT } from '../data/topicTaxonomy';

interface HeroProps {
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onFilterProduct: (product: string) => void;
  onFilterTopic?: (product: string, query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onFilterProduct,
  onFilterTopic
}) => {
  const { total, playable, designer, develop, playlistOnly, missing } = catalogCounts;
  const primaryPathCount = Math.min(
    LEARNING_PATHS.filter((p) => p.featured).length || PRIMARY_PATH_LIMIT,
    PRIMARY_PATH_LIMIT
  );

  const openTopic = (product: string, query: string) => {
    if (onFilterTopic) onFilterTopic(product, query);
    else {
      setSearchQuery(query);
      onFilterProduct(product);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white border-b border-slate-800 pt-10 pb-16">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="inline-flex items-center space-x-2 bg-blue-950/80 border border-blue-800/80 px-3 py-1 rounded-full text-xs font-mono text-blue-300 mb-6 shadow-inner">
          <CircuitBoard className="w-3.5 h-3.5 text-cyan-400" />
          <span>Independent EET · Altium Designer &amp; Develop library</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400 font-semibold">
            {total} named videos · {playable} playable embeds
          </span>
        </div>

        <div className="max-w-4xl space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Structured Altium Designer{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              &amp; Altium Develop tutorials
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            An independent Educational Engineering Team catalog — organized by Designer CAD topics and Develop
            collaboration workflows, with curated outcome paths. Not an Altium product, LMS, or generic electronics
            academy. Catalog counts come from the recovered video audit.
          </p>
        </div>

        <div className="mt-6 bg-slate-950/70 border border-amber-900/40 rounded-xl p-3.5 flex gap-3 max-w-3xl">
          <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-300">Independence notice:</span> Not affiliated with,
            authorized, sponsored, or approved by Altium LLC. Altium marks are trademarks of Altium LLC or its affiliates.
          </p>
        </div>

        <div className="mt-8 max-w-2xl">
          <div className="relative flex items-center shadow-2xl">
            <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${total} tutorials: DRC, ESP32, ActiveBOM, SolidWorks, Gerber...`}
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

        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => onFilterProduct('Altium Designer')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-900/30 flex items-center space-x-2 transition-all"
          >
            <Cpu className="w-4 h-4 text-cyan-300" />
            <span>Browse Designer ({designer})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onFilterProduct('Altium Develop')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-cyan-800 font-medium text-sm rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Browse Develop ({develop})</span>
          </button>

          <button
            onClick={() => setActiveTab('altiumDevelop')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-sm rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Target className="w-4 h-4 text-amber-400" />
            <span>Partner story · Altium Develop hub</span>
          </button>

          <button
            onClick={() => setActiveTab('paths')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-blue-300 border border-blue-900/80 font-mono text-xs rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>{primaryPathCount} primary paths</span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-8 text-slate-300">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-950 rounded-lg text-blue-400 border border-blue-800">
              <CircuitBoard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">{total}</div>
              <div className="text-xs text-slate-400">Named catalog videos</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950 rounded-lg text-emerald-400 border border-emerald-800">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">{designer}</div>
              <div className="text-xs text-slate-400">Altium Designer</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-cyan-950 rounded-lg text-cyan-400 border border-cyan-800">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">{develop}</div>
              <div className="text-xs text-slate-400">Altium Develop</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-950 rounded-lg text-amber-400 border border-amber-800">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-white font-mono">{primaryPathCount}</div>
              <div className="text-xs text-slate-400">Primary learning paths</div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-slate-500 font-mono">
          Honest status: {playable} oEmbed-public embeds · {playlistOnly} playlist-only · {missing} missing individual URLs.
          Canonical host: learn.eduengteam.com (LIVE).
        </p>

        {/* Designer / Develop topic libraries */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" /> Altium Designer topics
            </h2>
            <p className="text-xs text-slate-400">Opens the Designer catalog filtered to matching tutorials.</p>
            <div className="flex flex-wrap gap-2">
              {DESIGNER_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  title={topic.blurb}
                  onClick={() => openTopic('Altium Designer', topic.query)}
                  className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-blue-300 hover:border-blue-600"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-400" /> Altium Develop topics
            </h2>
            <p className="text-xs text-slate-400">
              Collaboration &amp; cloud workflows — full partner narrative on{' '}
              <button type="button" onClick={() => setActiveTab('altiumDevelop')} className="text-cyan-400 hover:underline">
                /altium-develop
              </button>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              {DEVELOP_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  title={topic.blurb}
                  onClick={() => openTopic('Altium Develop', topic.query)}
                  className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-cyan-300 hover:border-cyan-600"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wireframe: choose your goal */}
        <div className="mt-14 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Choose your goal</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { tab: 'paths', title: 'Follow a learning path', blurb: `${primaryPathCount} primary outcome paths` },
              { tab: 'projects', title: 'Build a hardware project', blurb: `${HARDWARE_PROJECTS.length} project hubs from catalog themes` },
              { tab: 'catalog', title: 'Browse the full catalog', blurb: `${total} recovered named videos` },
            ].map((g) => (
              <button
                key={g.tab}
                type="button"
                onClick={() => setActiveTab(g.tab)}
                className="text-left p-4 bg-slate-900/80 border border-slate-800 hover:border-blue-600 rounded-xl transition-colors"
              >
                <div className="text-sm font-semibold text-white">{g.title}</div>
                <div className="text-xs text-slate-400 mt-1">{g.blurb}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Browse by role / product teasers */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Browse by role
            </h2>
            <div className="flex flex-wrap gap-2">
              {ENGINEERING_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setActiveTab('roles')}
                  className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:border-purple-600"
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" /> Product collections
            </h2>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => onFilterProduct('Altium Designer')} className="text-xs px-3 py-1.5 bg-slate-900 border border-blue-900 rounded-lg text-blue-300">
                Designer · {designer}
              </button>
              <button type="button" onClick={() => onFilterProduct('Altium Develop')} className="text-xs px-3 py-1.5 bg-slate-900 border border-cyan-900 rounded-lg text-cyan-300">
                Develop · {develop}
              </button>
              <button type="button" onClick={() => setActiveTab('products')} className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 hover:border-slate-500">
                Topic hubs →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('altiumDevelop')}
            className="text-left p-5 bg-slate-900/60 border border-cyan-900/50 rounded-xl hover:border-cyan-600 transition-colors"
          >
            <div className="text-xs font-mono text-cyan-400 uppercase mb-1">Soft CTA · partner hub</div>
            <div className="text-sm font-bold text-white">Altium Develop learning narrative</div>
            <p className="text-xs text-slate-400 mt-1">
              Workflow map, personas, and tracked trial CTA — the URL to share with Altium.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('myActivity')}
            className="text-left p-5 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-emerald-700 transition-colors"
          >
            <div className="text-xs font-mono text-emerald-400 uppercase mb-1 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> My Activity
            </div>
            <div className="text-sm font-bold text-white">{playable} playable · {total} catalog</div>
            <p className="text-xs text-slate-400 mt-1">
              Your browser localStorage only — not site-wide traffic metrics.
            </p>
          </button>
        </div>

      </div>
    </section>
  );
};
