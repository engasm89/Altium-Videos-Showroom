import React, { useState } from 'react';
import { 
  Award, 
  X, 
  CheckCircle2, 
  Printer, 
  Download, 
  Share2, 
  ShieldCheck, 
  CircuitBoard,
  Sparkles
} from 'lucide-react';
import { LearningPath } from '../types';

interface CertificateModalProps {
  path: LearningPath;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ path, onClose }) => {
  const [engineerName, setEngineerName] = useState('Ashraf S. Engineer');
  const [organization, setOrganization] = useState('Electronics Design Group');
  const [certDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [certId] = useState(`EET-CERT-${Math.floor(100000 + Math.random() * 900000)}`);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>EET Official Curriculum Completion Certificate</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Customizer Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <label className="block text-slate-400 font-mono mb-1 uppercase text-[10px]">Engineer Full Name</label>
            <input
              type="text"
              value={engineerName}
              onChange={(e) => setEngineerName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-mono mb-1 uppercase text-[10px]">Company or University Name</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div 
          id="certificate-print-area"
          className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border-4 border-double border-amber-500/60 rounded-2xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl"
        >
          {/* Background Decorative Crest */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Header Branding */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-mono tracking-widest uppercase">
              <CircuitBoard className="w-4 h-4 text-cyan-400" />
              <span>Educational Engineering Team • EET</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide font-serif">
              CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">
              Electronics Product Development & CAD Mastery
            </p>
          </div>

          {/* Award Text */}
          <div className="space-y-3 py-4">
            <p className="text-xs text-slate-300 italic">This certifies that</p>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-serif border-b border-cyan-800/60 pb-2 inline-block px-8">
              {engineerName || 'Ashraf S. Engineer'}
            </div>
            {organization && (
              <div className="text-xs text-slate-400 font-mono">{organization}</div>
            )}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-2">
              has successfully completed all required coursework, hands-on Altium CAD tutorials, and practical project requirements for the curriculum:
            </p>
            <div className="text-lg sm:text-xl font-bold text-amber-300 bg-slate-950/80 border border-amber-500/40 px-6 py-2 rounded-xl inline-block shadow-md">
              {path.title}
            </div>
          </div>

          {/* Verification Seal Footer */}
          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-4">
            <div className="text-left space-y-0.5">
              <div className="text-slate-200 font-bold">Verification ID: <span className="text-cyan-400">{certId}</span></div>
              <div className="text-[10px]">Issued on: {certDate}</div>
              <div className="text-[10px] text-slate-500">learn.eduengteam.com/verify</div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="text-[10px] text-slate-300 text-left">
                <div className="font-bold text-white">Verified EET Industry Standard</div>
                <div>Educational Engineering Team</div>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Print or save as PDF for your LinkedIn profile or resume portfolio.
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
