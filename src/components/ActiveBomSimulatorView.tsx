import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Zap, 
  Search, 
  ShieldAlert, 
  TrendingDown, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { ALL_TUTORIALS } from '../data/catalog';
import { Tutorial } from '../types';

interface BomItem {
  id: string;
  designator: string;
  mpn: string;
  description: string;
  manufacturer: string;
  quantity: number;
  lifecycleStatus: 'Active' | 'NRND' | 'EOL' | 'Obsolete';
  stockCount: number;
  unitPriceUsd: number;
  leadTimeWeeks: number;
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  alternateMpn?: string;
  rohsCompliant: boolean;
}

const SAMPLE_PROJECT_BOMS: Record<string, { projectName: string; items: BomItem[] }> = {
  'arduino-uno': {
    projectName: 'Arduino UNO Rev3 R3 Reference BOM',
    items: [
      { id: '1', designator: 'U1', mpn: 'ATMEGA328P-PU', description: '8-bit AVR Microcontroller 32KB Flash 28-DIP', manufacturer: 'Microchip Technology', quantity: 1, lifecycleStatus: 'NRND', stockCount: 1420, unitPriceUsd: 2.45, leadTimeWeeks: 12, riskScore: 'Medium', alternateMpn: 'ATMEGA328P-AN', rohsCompliant: true },
      { id: '2', designator: 'U2', mpn: 'ATMEGA16U2-MU', description: 'USB-to-Serial IC 16KB Flash 32-VQFN', manufacturer: 'Microchip Technology', quantity: 1, lifecycleStatus: 'Active', stockCount: 18500, unitPriceUsd: 1.85, leadTimeWeeks: 4, riskScore: 'Low', rohsCompliant: true },
      { id: '3', designator: 'U3', mpn: 'NCP1117ST50T3G', description: 'Linear Voltage Regulator 5V 1A SOT-223', manufacturer: 'onsemi', quantity: 1, lifecycleStatus: 'Active', stockCount: 84000, unitPriceUsd: 0.32, leadTimeWeeks: 2, riskScore: 'Low', rohsCompliant: true },
      { id: '4', designator: 'Y1', mpn: 'CSTCE16M0V53-R0', description: 'Ceramic Resonator 16MHz 15pF SMD', manufacturer: 'Murata Electronics', quantity: 1, lifecycleStatus: 'EOL', stockCount: 120, unitPriceUsd: 0.48, leadTimeWeeks: 26, riskScore: 'High', alternateMpn: 'CSTNE16M0VH6C000R0', rohsCompliant: true },
      { id: '5', designator: 'C1, C2', mpn: 'CL21B104KBCNNNC', description: '0805 100nF 50V X7R Ceramic Cap', manufacturer: 'Samsung Electro-Mechanics', quantity: 2, lifecycleStatus: 'Active', stockCount: 450000, unitPriceUsd: 0.02, leadTimeWeeks: 1, riskScore: 'Low', rohsCompliant: true }
    ]
  },
  'esp32-devkit': {
    projectName: 'ESP32-WROOM-32E Wi-Fi/BT IoT Module Board',
    items: [
      { id: '1', designator: 'U1', mpn: 'ESP32-WROOM-32E-N4', description: 'Wi-Fi & Bluetooth MCU Module 4MB Flash SMD', manufacturer: 'Espressif Systems', quantity: 1, lifecycleStatus: 'Active', stockCount: 62000, unitPriceUsd: 2.85, leadTimeWeeks: 3, riskScore: 'Low', rohsCompliant: true },
      { id: '2', designator: 'U2', mpn: 'CP2102N-A02-GQFN28', description: 'USB to UART Bridge IC QFN-28', manufacturer: 'Silicon Labs', quantity: 1, lifecycleStatus: 'Active', stockCount: 29000, unitPriceUsd: 1.45, leadTimeWeeks: 6, riskScore: 'Low', rohsCompliant: true },
      { id: '3', designator: 'U3', mpn: 'AMS1117-3.3', description: 'LDO Regulator 3.3V 1A SOT-223', manufacturer: 'Advanced Monolithic Systems', quantity: 1, lifecycleStatus: 'Obsolete', stockCount: 0, unitPriceUsd: 0.15, leadTimeWeeks: 52, riskScore: 'Critical', alternateMpn: 'AP2112K-3.3TRG1', rohsCompliant: false },
      { id: '4', designator: 'D1, D2', mpn: '1N4148WS', description: 'Fast Switching Diode SOD-322', manufacturer: 'Diodes Incorporated', quantity: 2, lifecycleStatus: 'Active', stockCount: 120000, unitPriceUsd: 0.04, leadTimeWeeks: 2, riskScore: 'Low', rohsCompliant: true }
    ]
  },
  'buck-converter': {
    projectName: '24V to 5V 3A Synchronous Buck Regulator',
    items: [
      { id: '1', designator: 'U1', mpn: 'TPS54331DR', description: '3A 28V Step-Down DC-DC Regulator SOIC-8', manufacturer: 'Texas Instruments', quantity: 1, lifecycleStatus: 'Active', stockCount: 38000, unitPriceUsd: 1.12, leadTimeWeeks: 4, riskScore: 'Low', rohsCompliant: true },
      { id: '2', designator: 'L1', mpn: 'SRP7030-100M', description: 'Inductor Shielded 10uH 4A SMD 7x7mm', manufacturer: 'Bourns', quantity: 1, lifecycleStatus: 'Active', stockCount: 14000, unitPriceUsd: 0.85, leadTimeWeeks: 5, riskScore: 'Low', rohsCompliant: true },
      { id: '3', designator: 'C_IN', mpn: 'EEE-FK1E101P', description: 'Aluminum Electrolytic Cap 100uF 25V SMD', manufacturer: 'Panasonic', quantity: 1, lifecycleStatus: 'NRND', stockCount: 450, unitPriceUsd: 0.42, leadTimeWeeks: 18, riskScore: 'Medium', alternateMpn: 'EEE-FT1E101AP', rohsCompliant: true }
    ]
  }
};

interface ActiveBomSimulatorViewProps {
  onSelectTutorial?: (tutorial: Tutorial) => void;
}

export const ActiveBomSimulatorView: React.FC<ActiveBomSimulatorViewProps> = ({ onSelectTutorial }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('arduino-uno');
  const [filterRisk, setFilterRisk] = useState<string>('All');

  const currentProject = SAMPLE_PROJECT_BOMS[selectedPreset] || SAMPLE_PROJECT_BOMS['arduino-uno'];
  const items = currentProject.items;

  const filteredItems = items.filter(item => {
    if (filterRisk === 'All') return true;
    return item.riskScore === filterRisk || item.lifecycleStatus === filterRisk;
  });

  const totalCost = items.reduce((acc, it) => acc + (it.unitPriceUsd * it.quantity), 0);
  const totalHighRiskCount = items.filter(it => it.riskScore === 'High' || it.riskScore === 'Critical').length;
  const totalLeadTimeAvg = Math.round(items.reduce((acc, it) => acc + it.leadTimeWeeks, 0) / items.length);

  // ActiveBOM relevant tutorials
  const activeBomTutorials = ALL_TUTORIALS.filter(t => 
    t.title.toLowerCase().includes('bom') || 
    t.title.toLowerCase().includes('activebom') ||
    t.skills.includes('BOM Management') ||
    t.skills.includes('Supply Chain Risk')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-3 py-1 rounded-full">
            <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Supply Chain Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            ActiveBOM Component Risk Simulator
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Altium Develop ActiveBOM continuously monitors component lifecycle states (Active, NRND, EOL, Obsolete), distributor stock levels, lead-times, and RoHS compliance across live supply chains.
          </p>
        </div>

        {/* Project Selector Preset */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-2 rounded-xl shrink-0">
          <span className="text-xs font-mono text-slate-400 pl-2">Sample BOM:</span>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="arduino-uno">Arduino UNO R3 Board BOM</option>
            <option value="esp32-devkit">ESP32-WROOM IoT Board BOM</option>
            <option value="buck-converter">24V DC Buck Regulator BOM</option>
          </select>
        </div>
      </div>

      {/* Health Score Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Project Name</span>
          <div className="text-sm font-bold text-white truncate">{currentProject.projectName}</div>
          <div className="text-[10px] text-slate-400 font-mono">{items.length} line items</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Estimated Unit Cost</span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono">${totalCost.toFixed(2)} USD</div>
          <div className="text-[10px] text-slate-400">Distributor batch pricing</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">BOM Risk Rating</span>
          <div className={`text-xl font-extrabold font-mono flex items-center space-x-1.5 ${
            totalHighRiskCount > 0 ? 'text-rose-400' : 'text-emerald-400'
          }`}>
            {totalHighRiskCount > 0 ? (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>{totalHighRiskCount} At Risk</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Optimal (0 Risk)</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-slate-400">Requires active alternate MPNs</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Average Lead Time</span>
          <div className="text-xl font-extrabold text-amber-400 font-mono">{totalLeadTimeAvg} Weeks</div>
          <div className="text-[10px] text-slate-400">Maximum component delay</div>
        </div>

      </div>

      {/* ActiveBOM Grid Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>ActiveBOM Live Component Risk Feed</span>
          </h3>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-mono text-[10px]">Filter Risk:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono focus:outline-none"
            >
              <option value="All">All Items</option>
              <option value="Critical">Critical Risk Only</option>
              <option value="High">High Risk Only</option>
              <option value="Obsolete">Obsolete</option>
              <option value="EOL">EOL (End of Life)</option>
              <option value="NRND">NRND</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Designator</th>
                <th className="p-3">Manufacturer MPN</th>
                <th className="p-3">Description</th>
                <th className="p-3">Lifecycle</th>
                <th className="p-3">Distributor Stock</th>
                <th className="p-3">Lead Time</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Suggested Alternate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-mono font-bold text-cyan-300">{item.designator}</td>
                  <td className="p-3 font-mono text-white font-semibold">{item.mpn}</td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{item.description}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      item.lifecycleStatus === 'Active' 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                        : item.lifecycleStatus === 'NRND' 
                        ? 'bg-amber-950 text-amber-300 border-amber-800' 
                        : item.lifecycleStatus === 'EOL' 
                        ? 'bg-orange-950 text-orange-300 border-orange-800' 
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}>
                      {item.lifecycleStatus}
                    </span>
                  </td>
                  <td className="p-3 font-mono">
                    <span className={item.stockCount < 1000 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                      {item.stockCount.toLocaleString()} pcs
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{item.leadTimeWeeks} Wks</td>
                  <td className="p-3 font-mono text-emerald-400">${item.unitPriceUsd.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      item.riskScore === 'Low' 
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
                        : item.riskScore === 'Medium' 
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800' 
                        : 'bg-rose-950/80 text-rose-300 border-rose-800 animate-pulse'
                    }`}>
                      {item.riskScore} Risk
                    </span>
                  </td>
                  <td className="p-3 font-mono text-xs">
                    {item.alternateMpn ? (
                      <span className="text-cyan-300 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                        {item.alternateMpn}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Linked ActiveBOM Tutorials Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Learn ActiveBOM Workflow Masterclasses ({activeBomTutorials.length} Lessons)</span>
        </h3>
        
        <p className="text-xs text-slate-300">
          Watch step-by-step videos on how to integrate live supplier data feeds, configure automatic component alternate rules, and auto-generate procurement release packages in Altium Develop.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {activeBomTutorials.slice(0, 3).map((tut) => (
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
