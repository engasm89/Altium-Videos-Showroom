import React, { useState } from 'react';
import { 
  Layers, 
  Cpu, 
  Zap, 
  CheckCircle, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  Calculator
} from 'lucide-react';
import { ALL_TUTORIALS } from '../data/catalog';
import { Tutorial } from '../types';

interface LayerConfig {
  name: string;
  type: 'Signal' | 'Power Plane' | 'Ground Plane' | 'Dielectric' | 'Solder Mask';
  material: string;
  thicknessMm: number;
  copperWeightOz?: number;
  color: string;
}

const STACKUP_PRESETS: Record<string, { title: string; layers: LayerConfig[]; impedance50WidthMil: number; diffPair100WidthMil: number }> = {
  '4-layer-standard': {
    title: 'Standard 4-Layer High-Frequency Stackup (1.6mm FR-4)',
    impedance50WidthMil: 12.5,
    diffPair100WidthMil: 6.0,
    layers: [
      { name: 'Top Silkscreen', type: 'Solder Mask', material: 'Liquid Photoimageable', thicknessMm: 0.02, color: 'bg-emerald-600' },
      { name: 'Layer 1: Top Signal (High Speed)', type: 'Signal', material: 'Copper Foil', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-amber-500' },
      { name: 'Dielectric Prepreg (1080)', type: 'Dielectric', material: 'FR-4 (Er = 4.2)', thicknessMm: 0.2, color: 'bg-slate-700' },
      { name: 'Layer 2: Ground Plane (GND)', type: 'Ground Plane', material: 'Copper Plane', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-blue-600' },
      { name: 'Core Dielectric (FR-4)', type: 'Dielectric', material: 'FR-4 Core (Er = 4.4)', thicknessMm: 1.0, color: 'bg-slate-800' },
      { name: 'Layer 3: Power Plane (VCC)', type: 'Power Plane', material: 'Copper Plane', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-purple-600' },
      { name: 'Dielectric Prepreg (1080)', type: 'Dielectric', material: 'FR-4 (Er = 4.2)', thicknessMm: 0.2, color: 'bg-slate-700' },
      { name: 'Layer 4: Bottom Signal', type: 'Signal', material: 'Copper Foil', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-amber-500' },
      { name: 'Bottom Silkscreen', type: 'Solder Mask', material: 'Liquid Photoimageable', thicknessMm: 0.02, color: 'bg-emerald-600' }
    ]
  },
  '6-layer-high-density': {
    title: '6-Layer Controlled Impedance Stackup (SIG-GND-SIG-PWR-GND-SIG)',
    impedance50WidthMil: 8.2,
    diffPair100WidthMil: 5.0,
    layers: [
      { name: 'Top Silkscreen', type: 'Solder Mask', material: 'LPI Solder Mask', thicknessMm: 0.02, color: 'bg-emerald-600' },
      { name: 'Layer 1: Top Signal (Microstrip)', type: 'Signal', material: 'Copper Foil', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-amber-500' },
      { name: 'Prepreg 2116', type: 'Dielectric', material: 'FR-4 (Er = 4.1)', thicknessMm: 0.12, color: 'bg-slate-700' },
      { name: 'Layer 2: Ground Plane (GND1)', type: 'Ground Plane', material: 'Copper Plane', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-blue-600' },
      { name: 'Core FR-4', type: 'Dielectric', material: 'FR-4 Core', thicknessMm: 0.4, color: 'bg-slate-800' },
      { name: 'Layer 3: Inner Signal 1', type: 'Signal', material: 'Stripline Copper', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-amber-500' },
      { name: 'Prepreg 2116', type: 'Dielectric', material: 'FR-4 (Er = 4.1)', thicknessMm: 0.12, color: 'bg-slate-700' },
      { name: 'Layer 4: Power Plane (3V3 / 5V)', type: 'Power Plane', material: 'Copper Plane', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-purple-600' },
      { name: 'Core FR-4', type: 'Dielectric', material: 'FR-4 Core', thicknessMm: 0.4, color: 'bg-slate-800' },
      { name: 'Layer 5: Ground Plane (GND2)', type: 'Ground Plane', material: 'Copper Plane', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-blue-600' },
      { name: 'Prepreg 2116', type: 'Dielectric', material: 'FR-4 (Er = 4.1)', thicknessMm: 0.12, color: 'bg-slate-700' },
      { name: 'Layer 6: Bottom Signal', type: 'Signal', material: 'Copper Foil', thicknessMm: 0.035, copperWeightOz: 1, color: 'bg-amber-500' }
    ]
  }
};

interface StackupInspectorViewProps {
  onSelectTutorial?: (tutorial: Tutorial) => void;
}

export const StackupInspectorView: React.FC<StackupInspectorViewProps> = ({ onSelectTutorial }) => {
  const [selectedStackup, setSelectedStackup] = useState<string>('4-layer-standard');
  const [copperOz, setCopperOz] = useState<number>(1);

  const preset = STACKUP_PRESETS[selectedStackup] || STACKUP_PRESETS['4-layer-standard'];
  
  const totalThickness = preset.layers.reduce((acc, l) => acc + l.thicknessMm, 0);

  const stackupTutorials = ALL_TUTORIALS.filter(t => 
    t.title.toLowerCase().includes('stack') || 
    t.title.toLowerCase().includes('layer') ||
    t.skills.includes('High-Speed Routing')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Layer Stackup & Impedance Engineer</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            PCB Layer Stackup & Impedance Calculator
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Configure PCB stackups in Altium Designer Layer Stack Manager. Calculate controlled 50Ω single-ended and 100Ω differential trace widths across dielectric materials.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-xl shrink-0">
          <span className="text-xs font-mono text-slate-400 pl-2">Preset:</span>
          <select
            value={selectedStackup}
            onChange={(e) => setSelectedStackup(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none"
          >
            <option value="4-layer-standard">4-Layer Standard High-Speed (1.6mm)</option>
            <option value="6-layer-high-density">6-Layer High-Density HDI Stackup</option>
          </select>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Board Thickness</span>
          <div className="text-2xl font-extrabold text-white font-mono">{totalThickness.toFixed(2)} mm</div>
          <div className="text-[10px] text-slate-400">Standard Fab Target (1.6mm ±10%)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">50Ω Microstrip Trace Width</span>
          <div className="text-2xl font-extrabold text-cyan-300 font-mono">{preset.impedance50WidthMil} mil</div>
          <div className="text-[10px] text-slate-400">Target for single-ended signals (RF / Clocks)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">100Ω Differential Pair Width</span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{preset.diffPair100WidthMil} mil</div>
          <div className="text-[10px] text-slate-400">Target for USB 2.0 / Ethernet (5mil gap)</div>
        </div>

      </div>

      {/* Visual Stackup Layer Rendering */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Cross-Sectional Physical Layer Stackup Visualization</span>
        </h3>

        <div className="space-y-1.5 pt-2">
          {preset.layers.map((layer, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex items-center justify-between text-xs space-x-4"
            >
              <div className="flex items-center space-x-3">
                <span className={`w-3 h-8 rounded shrink-0 ${layer.color}`} />
                <div>
                  <div className="font-bold text-white">{layer.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{layer.type} • {layer.material}</div>
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="text-slate-200">{layer.thicknessMm} mm</div>
                {layer.copperWeightOz && (
                  <div className="text-[10px] text-amber-400">{layer.copperWeightOz} oz Cu (35µm)</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stackup Masterclass Tutorials */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-cyan-400" />
          <span>Layer Stack Manager & Impedance Tutorials ({stackupTutorials.length} Lessons)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stackupTutorials.slice(0, 3).map((tut) => (
            <div
              key={tut.id}
              onClick={() => onSelectTutorial && onSelectTutorial(tut)}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl cursor-pointer transition-all space-y-2 group"
            >
              <div className="text-[10px] font-mono text-cyan-400">{tut.product}</div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                {tut.title}
              </h4>
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                <span>{tut.durationFormatted}</span>
                <span className="text-cyan-400 group-hover:underline flex items-center space-x-1">
                  <span>Watch</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
