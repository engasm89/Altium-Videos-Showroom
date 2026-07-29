import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Cpu, 
  ShoppingBag, 
  Wrench, 
  Terminal, 
  Briefcase, 
  ShieldAlert, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Clock,
  Boxes
} from 'lucide-react';
import { ENGINEERING_ROLES } from '../data/roles';
import { ALL_TUTORIALS } from '../data/catalog';
import { Tutorial } from '../types';
import { useDocumentTitle } from '../utils/documentTitle';

interface RoleViewProps {
  onSelectTutorial: (tutorial: Tutorial) => void;
  onSelectPath: (pathId: string) => void;
  initialRoleSlug?: string;
}

export const RoleView: React.FC<RoleViewProps> = ({
  onSelectTutorial,
  onSelectPath,
  initialRoleSlug,
}) => {
  const slugMatched = initialRoleSlug
    ? ENGINEERING_ROLES.find((r) => r.slug === initialRoleSlug)?.id
    : undefined;
  const [selectedRoleId, setSelectedRoleId] = useState<string>(slugMatched || 'role-pcb');
  useDocumentTitle(
    ENGINEERING_ROLES.find((r) => r.id === (slugMatched || selectedRoleId))?.title || 'Roles'
  );

  React.useEffect(() => {
    if (!initialRoleSlug) return;
    const match = ENGINEERING_ROLES.find((r) => r.slug === initialRoleSlug);
    if (match) setSelectedRoleId(match.id);
  }, [initialRoleSlug]);

  const selectedRole = ENGINEERING_ROLES.find(r => r.id === selectedRoleId) || ENGINEERING_ROLES[0];
  const roleTutorials = ALL_TUTORIALS.filter(t => t.role === selectedRole.category);

  const renderRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Wrench': return <Wrench className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'Users': return <Briefcase className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Boxes': return <Boxes className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800 px-3 py-1 rounded-full">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>{ENGINEERING_ROLES.length} Role Hubs</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineering Role Hubs
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Role hubs covering catalog categories — not a claim of every industry persona. Each hub maps recommended paths and linked lessons from the imported EET audit.
          For Altium Develop outcome journeys (business outcomes + workflow + tool + CTA), see{' '}
          <Link to="/personas" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
            Persona journeys
          </Link>
          .
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ENGINEERING_ROLES.map((role) => {
          const isSelected = role.id === selectedRoleId;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className={`p-2.5 rounded-lg w-fit mb-3 ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400'}`}>
                {renderRoleIcon(role.iconName)}
              </div>
              <div>
                <h4 className="text-xs font-bold leading-snug">{role.title}</h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Role Dashboard Pane */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
        
        {/* Role Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-950 border border-purple-800 rounded-xl text-purple-300">
                {renderRoleIcon(selectedRole.iconName)}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedRole.title}</h3>
                <span className="text-xs font-mono text-purple-400">{selectedRole.category}</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              {selectedRole.description}
            </p>
          </div>

          <button
            onClick={() => onSelectPath(selectedRole.recommendedPathId)}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shrink-0 shadow-lg shadow-purple-900/30 transition-all"
          >
            <span>Launch Recommended Learning Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsibilities & Primary Workflows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-purple-400">Key Responsibilities</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {selectedRole.keyResponsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400">Primary Software Workflows</h4>
            <div className="flex flex-wrap gap-2">
              {selectedRole.primaryWorkflows.map((wf, idx) => (
                <span key={idx} className="text-xs bg-slate-900 text-cyan-300 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
                  {wf}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Curated Tutorials for this Persona */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Recommended Tutorials for {selectedRole.title}</h4>
            <span className="text-xs font-mono text-slate-400">{roleTutorials.length} Tutorials Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleTutorials.slice(0, 6).map((tut) => (
              <div
                key={tut.id}
                onClick={() => onSelectTutorial(tut)}
                className="p-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400">{tut.product}</span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{tut.durationFormatted}</span>
                  </span>
                </div>
                <h5 className="font-semibold text-xs text-white line-clamp-2 hover:text-purple-300 transition-colors">
                  {tut.title}
                </h5>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {tut.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
