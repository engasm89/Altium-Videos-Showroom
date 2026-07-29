import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle, 
  Wrench, 
  BookOpen, 
  Layers, 
  Cpu, 
  ArrowRight,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { ALL_TUTORIALS } from '../data/catalog';
import { Tutorial } from '../types';

interface DrcViolationRule {
  id: string;
  ruleCategory: 'Clearance' | 'High Speed' | 'Manufacturing' | 'Placement' | 'Power / Plane';
  errorName: string;
  description: string;
  rootCause: string;
  ipcStandard: string;
  stepByStepFix: string[];
  shortcutKey: string;
  relatedTutorialId?: string;
}

const DRC_RULES_DATABASE: DrcViolationRule[] = [
  {
    id: 'clearance-trace-pad',
    ruleCategory: 'Clearance',
    errorName: 'Clearance Constraint Violation (Track to Pad < 6mil)',
    description: 'Electrical distance between copper trace and adjacent component pad is lower than defined DRC minimum (e.g., 4.2mil vs required 6.0mil).',
    rootCause: 'Trace routed too close to BGA or QFN land pads without fine-pitch rule scope override.',
    ipcStandard: 'IPC-2221B Section 6.3 - Electrical Clearance for 50V DC',
    stepByStepFix: [
      'Press `D -> R` to open Design Rules Editor.',
      'Navigate to `Design Rules -> Electrical -> Clearance`.',
      'Create a new sub-rule scoped to `InComponent(\'U1\')`.',
      'Set targeted Clearance to 4mil for high-density BGA escape area.'
    ],
    shortcutKey: 'D -> R',
    relatedTutorialId: 'tut-002'
  },
  {
    id: 'diff-pair-mismatch',
    ruleCategory: 'High Speed',
    errorName: 'Differential Pair Length Mismatch (> 5mil skew)',
    description: 'High-speed differential signal lines (e.g. USB 2.0 D+/D- or Ethernet TX+/TX-) exceed phase skew tolerance.',
    rootCause: 'Unequal path routing length around PCB obstacles or board corners.',
    ipcStandard: 'IPC-2141A High-Speed Circuit Boards Design Guide',
    stepByStepFix: [
      'Press `Ctrl + W` or select `Interactive Differential Pair Tuning`.',
      'Click on the shorter net of the differential pair.',
      'Adjust accordion amplitude and pitch until length skew is within < 1mil.',
      'Verify phase alignment in 2D mode with `Shift + S` single layer view.'
    ],
    shortcutKey: 'Shift + A',
    relatedTutorialId: 'tut-008'
  },
  {
    id: 'unrouted-net-ratsnest',
    ruleCategory: 'Power / Plane',
    errorName: 'Un-Routed Net Constraint Failure (Ratsnest Line Remaining)',
    description: 'One or more schematic connections have no copper trace or polygon plane connection on the PCB layout.',
    rootCause: 'Forgotten ground net connection or isolated copper polygon island.',
    ipcStandard: 'IPC-D-325 Documenting Printed Boards',
    stepByStepFix: [
      'Press `N` to show/hide net lines and identify unconnected node.',
      'Press `T -> V` to place ground stitching vias if isolated copper pour.',
      'Repour polygon pour using `T -> G -> A` (Rebuild All Polygons).',
      'Run DRC check with `T -> D` to verify 0 un-routed net errors.'
    ],
    shortcutKey: 'T -> D',
    relatedTutorialId: 'tut-003'
  },
  {
    id: 'silk-to-solder-mask',
    ruleCategory: 'Manufacturing',
    errorName: 'Silkscreen Overlapping Solder Mask Opening (< 4mil)',
    description: 'White component text or outline printed over exposed copper pad, leading to soldering defects during reflow.',
    rootCause: '3D footprint component outline drawn inside soldering pad boundary.',
    ipcStandard: 'IPC-7351B Generic Requirements for Surface Mount Design',
    stepByStepFix: [
      'Double-click component silkscreen text in PCB Editor.',
      'Move text away from solder mask opening or set Auto-Position.',
      'In Footprint Library, clip silkscreen to be at least 4mil away from pad edge.',
      'Run Manufacturing DRC Rule in `Design Rules -> Manufacturing -> SilkToSolderMaskClearance`.'
    ],
    shortcutKey: 'L',
    relatedTutorialId: 'tut-007'
  },
  {
    id: 'component-keepout-collision',
    ruleCategory: 'Placement',
    errorName: 'Component 3D Body Keepout Height Violation',
    description: 'Component 3D STEP model collides with adjacent connector, heatsink, or mechanical enclosure lid.',
    rootCause: 'Tall electrolytic capacitor or inductor placed under mechanical shield or PCB daughterboard.',
    ipcStandard: 'IPC-2222 Section 5 - Mechanical Layout Considerations',
    stepByStepFix: [
      'Press `3` to enter 3D Real-Time Render Mode.',
      'Press `L` and enable Mechanical 3D Body layer visibility.',
      'Use `Tools -> Component Placement -> Reposition` to shift component.',
      'Export 3D STEP file and verify in SolidWorks via Altium ECAD-MCAD CoDesigner.'
    ],
    shortcutKey: '3',
    relatedTutorialId: 'tut-010'
  }
];

interface DrcAssistantViewProps {
  onSelectTutorial?: (tutorial: Tutorial) => void;
}

export const DrcAssistantView: React.FC<DrcAssistantViewProps> = ({ onSelectTutorial }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeRuleId, setActiveRuleId] = useState<string>(DRC_RULES_DATABASE[0].id);

  const filteredRules = DRC_RULES_DATABASE.filter(rule => {
    const matchesCat = selectedCategory === 'All' || rule.ruleCategory === selectedCategory;
    const matchesQuery = rule.errorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.ipcStandard.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const activeRule = DRC_RULES_DATABASE.find(r => r.id === activeRuleId) || DRC_RULES_DATABASE[0];

  const matchingTutorial = activeRule.relatedTutorialId 
    ? ALL_TUTORIALS.find(t => t.id === activeRule.relatedTutorialId)
    : ALL_TUTORIALS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Diagnostic Design Rule Check Assistant</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            PCB DRC Rulebook & Resolution Guide
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Diagnose and fix design rule violations in Altium Designer. Cross-reference IPC manufacturing standards and step-by-step resolution commands.
          </p>
        </div>
      </div>

      {/* Main Diagnostic Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Rule Selector List */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search DRC error (e.g., 'Clearance', 'Diff Pair', 'Silk')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 overflow-x-auto pb-1">
              {['All', 'Clearance', 'High Speed', 'Manufacturing', 'Placement', 'Power / Plane'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === cat ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredRules.map((rule) => {
              const isActive = rule.id === activeRule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setActiveRuleId(rule.id)}
                  className={`p-4 rounded-xl border text-xs cursor-pointer transition-all space-y-2 ${
                    isActive 
                      ? 'bg-slate-900 border-blue-500 shadow-lg' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                      {rule.ruleCategory}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">{rule.shortcutKey}</span>
                  </div>

                  <h4 className="font-bold text-white text-sm">
                    {rule.errorName}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {rule.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Detailed DRC Resolution Pane */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wide">DRC Rule Diagnostic</span>
                <h3 className="text-xl font-bold text-white mt-1">{activeRule.errorName}</h3>
              </div>
              <span className="p-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono text-xs font-bold">
                Hotkey: {activeRule.shortcutKey}
              </span>
            </div>

            {/* Root Cause Box */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Root Cause Analysis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeRule.rootCause}
              </p>
            </div>

            {/* IPC Standard Reference */}
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>IPC Manufacturing Standard:</strong> {activeRule.ipcStandard}</span>
            </div>

            {/* Step by Step Fix */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wide flex items-center space-x-2">
                <Wrench className="w-3.5 h-3.5 text-blue-400" />
                <span>Step-by-Step Resolution Steps in Altium Designer</span>
              </h4>

              <ol className="space-y-2 text-xs text-slate-200 pl-2">
                {activeRule.stepByStepFix.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-mono font-bold text-cyan-400 shrink-0">{idx + 1}.</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Linked Tutorial CTA */}
          {matchingTutorial && (
            <div className="p-4 bg-blue-950/60 border border-blue-800 rounded-xl flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-blue-300 uppercase">Recommended Video Lesson</div>
                <div className="text-xs font-bold text-white truncate max-w-sm">{matchingTutorial.title}</div>
              </div>

              <button
                onClick={() => onSelectTutorial && onSelectTutorial(matchingTutorial)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0 transition-colors"
              >
                <span>Watch Tutorial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
