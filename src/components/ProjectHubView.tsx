import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  Download, 
  Clock, 
  Play,
  Github
} from 'lucide-react';
import { HARDWARE_PROJECTS } from '../data/projects';
import { ALL_TUTORIALS } from '../data/catalog';
import { Tutorial } from '../types';
import { useDocumentTitle } from '../utils/documentTitle';

interface ProjectHubViewProps {
  onSelectTutorial: (tutorial: Tutorial) => void;
  initialProjectSlug?: string;
}

export const ProjectHubView: React.FC<ProjectHubViewProps> = ({
  onSelectTutorial,
  initialProjectSlug,
}) => {
  const navigate = useNavigate();
  const focused = initialProjectSlug
    ? HARDWARE_PROJECTS.find((p) => p.slug === initialProjectSlug)
    : undefined;
  const projects = focused ? [focused] : HARDWARE_PROJECTS;
  useDocumentTitle(focused?.title || 'Projects');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-amber-950 text-amber-300 border border-amber-800 px-3 py-1 rounded-full">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Project-Based Learning Hubs</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {focused ? focused.title : 'Complete Hardware Electronics Projects'}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          {focused
            ? focused.description
            : 'Theme hubs linked to recovered EET catalog lessons. Status badges describe curriculum linkage — not invented download archives.'}
        </p>
        {focused && (
          <button type="button" onClick={() => navigate('/projects')} className="text-xs text-blue-400 hover:underline font-mono">
            ← All projects
          </button>
        )}
        {initialProjectSlug && !focused && (
          <p className="text-xs text-amber-300 font-mono">No project matches slug {initialProjectSlug}.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {projects.map((proj) => {
          const linkedTutorials = ALL_TUTORIALS.filter(t => proj.tutorialIds.includes(t.id));

          return (
            <div 
              key={proj.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                      {proj.category}
                    </span>
                    <h3 className="text-xl font-bold text-white pt-1">
                      <button type="button" className="hover:text-amber-300 text-left" onClick={() => navigate(`/projects/${proj.slug}`)}>
                        {proj.title}
                      </button>
                    </h3>
                    <p className="text-xs text-slate-400">{proj.subtitle}</p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-400 shrink-0">
                    <div className="flex items-center space-x-1 justify-end text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{proj.estimatedTime}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{proj.difficulty}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  {proj.description}
                </p>

                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <div className="text-slate-400 text-[9px] uppercase">Schematic</div>
                    <div className="text-emerald-400 font-semibold mt-0.5">{proj.schematicStatus}</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <div className="text-slate-400 text-[9px] uppercase">PCB Layout</div>
                    <div className="text-emerald-400 font-semibold mt-0.5">{proj.pcbStatus}</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <div className="text-slate-400 text-[9px] uppercase">BOM Risk</div>
                    <div className="text-cyan-400 font-semibold mt-0.5">{proj.bomStatus}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Step-by-Step Project Lessons ({linkedTutorials.length})</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {linkedTutorials.map((tut, idx) => (
                      <div
                        key={tut.id}
                        onClick={() => onSelectTutorial(tut)}
                        className="p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800/80 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <span className="font-mono text-[10px] text-amber-400 bg-amber-950 border border-amber-800 px-1.5 py-0.5 rounded shrink-0">
                            Step {idx + 1}
                          </span>
                          <span className="text-slate-200 truncate">{tut.title}</span>
                        </div>
                        <Play className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                {proj.downloadUrl ? (
                  <a
                    href={proj.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center space-x-1.5 font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download CAD Zip</span>
                  </a>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500">
                    CAD project zip not published yet
                  </span>
                )}

                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg flex items-center space-x-1.5 font-medium transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Repo</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
