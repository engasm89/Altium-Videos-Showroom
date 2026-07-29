import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { ALL_TUTORIALS } from '../data/catalog';
import { getAllSkillsList } from '../utils/search';
import { Breadcrumbs, Badge } from './ui';

interface SkillsIndexViewProps {
  setActiveTab: (tab: string) => void;
}

/**
 * Lightweight app-shell "browse by skill" hub — a thin index of skill tags that
 * hands off to the catalog's own search/filter for actual tutorial results.
 * Detailed catalog rendering stays owned by the catalog view.
 */
export const SkillsIndexView: React.FC<SkillsIndexViewProps> = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const skills = useMemo(() => getAllSkillsList(ALL_TUTORIALS), []);

  const countsBySkill = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_TUTORIALS.forEach((t) => {
      t.skills.forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return counts;
  }, []);

  const handleSelectSkill = (skill: string) => {
    navigate(`/tutorials?skill=${encodeURIComponent(skill)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-100">

      <Breadcrumbs
        items={[
          { label: 'Home', onClick: () => setActiveTab('home') },
          { label: 'Skills' },
        ]}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 text-xs font-mono bg-blue-950 text-blue-300 border border-blue-800 px-3 py-1 rounded-full">
          <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{skills.length} Tagged Skills</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
          Browse by Skill
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Every tutorial is tagged with the concrete engineering skills it teaches. Pick a skill below to jump
          straight to the matching tutorials in the catalog.
        </p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <button key={skill} onClick={() => handleSelectSkill(skill)} className="group">
            <Badge variant="outline" className="text-xs normal-case tracking-normal font-sans px-3 py-1.5 group-hover:border-brand group-hover:text-white transition-colors">
              {skill}
              <span className="text-slate-500 group-hover:text-brand-bright">· {countsBySkill[skill] || 0}</span>
            </Badge>
          </button>
        ))}
      </div>

    </div>
  );
};
