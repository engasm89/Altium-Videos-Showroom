import React, { useState } from 'react';
import { BookA, Search, BookOpen } from 'lucide-react';

const GLOSSARY_TERMS = [
  { term: 'ActiveBOM', definition: 'A tool within Altium Designer that provides real-time component supply chain intelligence, pricing, and availability.' },
  { term: 'DRC (Design Rule Check)', definition: 'An automated process that checks if the physical PCB layout adheres to a defined set of electrical and manufacturing rules.' },
  { term: 'HDI (High Density Interconnect)', definition: 'A printed circuit board with a higher wiring density per unit area than conventional printed circuit boards.' },
  { term: 'Impedance Control', definition: 'The practice of designing PCB traces so that the impedance matches the source or load, critical for high-speed signals (e.g., 50Ω for RF).' },
  { term: 'Microstrip', definition: 'A type of electrical transmission line that can be fabricated using printed circuit board technology, typically routed on the top or bottom external layers.' },
  { term: 'Stripline', definition: 'A transmission line routed on an internal layer of a PCB, sandwiched between two reference (power or ground) planes.' },
  { term: 'Via', definition: 'An electrical connection between layers in a printed circuit board. Types include through-hole, blind, and buried vias.' },
  { term: 'Prepreg', definition: 'Fiberglass impregnated with resin that hasn\'t been fully cured. Used as the glue to hold core layers together in a multilayer PCB.' },
  { term: 'FR-4', definition: 'A standard grade designation for glass-reinforced epoxy laminate material. The most common base material for PCBs.' },
  { term: 'Solder Mask', definition: 'A thin polymer layer applied to the copper traces of a printed circuit board for protection against oxidation and to prevent solder bridges.' },
  { term: 'Silkscreen', definition: 'A layer of ink used to identify components, test points, PCB and PCBA part numbers, warning symbols, and company logos.' },
  { term: 'Gerber File', definition: 'The standard file format used by printed circuit board (PCB) fabrication houses to manufacture the boards.' },
  { term: 'Netlist', definition: 'A text-based list of all the electrical connections (nets) between components in a circuit design.' },
  { term: 'Polygon Pour', definition: 'A method of filling an empty area of a PCB layer with solid copper, typically tied to a Ground or Power net.' },
  { term: 'Differential Pair', definition: 'Two complementary signals routed closely together, used to transmit high-speed data with high immunity to noise (e.g., USB, Ethernet).' }
].sort((a, b) => a.term.localeCompare(b.term));

export const GlossaryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTerms = GLOSSARY_TERMS.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
            <BookA className="w-3.5 h-3.5 text-cyan-400" />
            <span>PCB Design Terminology</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hardware Engineering Glossary
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            A quick reference guide for common printed circuit board design terms, acronyms, and Altium-specific vocabulary.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search glossary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {filteredTerms.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-300">No terms found</h3>
          <p className="text-xs text-slate-500 mt-2">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2 hover:border-slate-700 transition-colors">
              <h4 className="text-sm font-bold text-cyan-300">{item.term}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.definition}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
