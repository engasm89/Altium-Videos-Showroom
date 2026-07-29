import React, { useEffect } from 'react';
import { Cpu, Cloud, CheckCircle, ArrowRight } from 'lucide-react';
import { ALL_TUTORIALS } from '../data/catalog';
import { Tutorial } from '../types';

interface ProductCatalogViewProps {
  onSelectTutorial: (tutorial: Tutorial) => void;
  onFilterProduct: (product: string) => void;
  initialProductSlug?: string;
}

const PRODUCT_SLUGS: Record<string, string> = {
  'altium-designer': 'Altium Designer',
  'altium-develop': 'Altium Develop',
};

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  onSelectTutorial: _onSelectTutorial,
  onFilterProduct,
  initialProductSlug,
}) => {
  const designerTutorials = ALL_TUTORIALS.filter(t => t.product === 'Altium Designer');
  const developTutorials = ALL_TUTORIALS.filter(t => t.product === 'Altium Develop');

  useEffect(() => {
    if (!initialProductSlug) return;
    const product = PRODUCT_SLUGS[initialProductSlug];
    if (product) onFilterProduct(product);
  }, [initialProductSlug]); // intentionally omit onFilterProduct to avoid remount loops

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      <div className="space-y-3">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Product Collections & Workflow Comparison
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Altium Designer focuses on core schematic capture, component footprints, and high-density PCB layout. Altium Develop connects electrical, mechanical, software, procurement, and management teams in a unified cloud environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-950 border border-blue-800 rounded-xl text-blue-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Altium Designer</h3>
                  <span className="text-xs font-mono text-blue-400">
                    {designerTutorials.length} Enriched Tutorials
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-1 rounded">
                Desktop CAD
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              Foundational CAD software for schematic entry, custom footprint creation, interactive trace routing, high-frequency design rules, thermal via placement, and Gerber/NC Drill manufacturing outputs.
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Schematic Capture & Hierarchical Sheet Structures</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>IPC-7351 Compliant Footprint Generator & 3D STEP Sync</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Interactive Walkaround, Push & Hug Routing Engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>OutJob Automated Gerber X2 & Draftsman Assembly Drawings</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onFilterProduct('Altium Designer')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-lg"
          >
            <span>Browse {designerTutorials.length} Altium Designer Tutorials</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-cyan-950 border border-cyan-800 rounded-xl text-cyan-400">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Altium Develop</h3>
                  <span className="text-xs font-mono text-cyan-400">
                    {developTutorials.length} Enriched Tutorials
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-1 rounded">
                Cloud Ecosystem
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
              Connected cloud platform uniting hardware engineers with non-CAD stakeholders. Features AI-driven PRD requirement parsing, live ActiveBOM distributor feeds, SolidWorks ECAD-MCAD sync, and executive review dashboards.
            </p>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>AI-Assisted Requirements Extraction & Traceability</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>ActiveBOM Live Lead-Time & Component Obsolescence Alerts</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>ECAD-MCAD CoDesigner with SolidWorks, Creo & Fusion 360</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Browser-Based Design Reviews & Revision Diff Inspection</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onFilterProduct('Altium Develop')}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors shadow-lg"
          >
            <span>Browse {developTutorials.length} Altium Develop Tutorials</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
