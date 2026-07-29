import React from 'react';
import { CircuitBoard, Shield, ExternalLink, Mail } from 'lucide-react';
import { ALL_TUTORIALS } from '../data/catalog';
import { LEARNING_PATHS } from '../data/learningPaths';
import { APP_STAGE_LABEL, APP_VERSION } from '../utils/siteConfig';
import { ReportContentControl } from './ReportContentControl';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenAltiumLink: (title: string, url: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAltiumLink }) => {
  const totalTutorials = ALL_TUTORIALS.length;
  const designerCount = ALL_TUTORIALS.filter((t) => t.product === 'Altium Designer').length;
  const developCount = ALL_TUTORIALS.filter((t) => t.product === 'Altium Develop').length;
  const pathCount = LEARNING_PATHS.length;

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-white">
                <CircuitBoard className="w-5 h-5 text-cyan-200" />
              </div>
              <span className="font-display font-bold text-base text-white">EET Library</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Independent electronics product development learning platform created by the Educational Engineering Team.
              {' '}{totalTutorials} practical Altium Designer &amp; Altium Develop tutorials.
            </p>
            <p className="font-mono text-xs text-slate-400">
              learn.eduengteam.com
            </p>
            <p className="font-mono text-[11px] text-amber-300/90">
              {APP_STAGE_LABEL} · v{APP_VERSION}
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Learning Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('paths')} className="hover:text-brand-bright transition-colors">
                  {pathCount} Curated Learning Paths
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('catalog')} className="hover:text-brand-bright transition-colors">
                  All {totalTutorials} Tutorials Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('projects')} className="hover:text-brand-bright transition-colors">
                  Project Hubs (Arduino, ESP32, Buck)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('altiumDevelop')} className="hover:text-brand-bright transition-colors">
                  Altium Develop Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('workflow')} className="hover:text-brand-bright transition-colors">
                  Product Development Workflow
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('roles')} className="hover:text-brand-bright transition-colors">
                  Engineering Roles Taxonomy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('personas')} className="hover:text-brand-bright transition-colors">
                  Persona Journeys (Develop)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('skills')} className="hover:text-brand-bright transition-colors">
                  Browse by Skill
                </button>
              </li>
            </ul>
          </div>

          {/* Software Products */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">Software Products</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('products')} className="hover:text-brand-bright transition-colors">
                  Altium Designer Tutorials ({designerCount})
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('products')} className="hover:text-brand-bright transition-colors">
                  Altium Develop Tutorials ({developCount})
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('altiumDevelop')} className="hover:text-cyan-300 transition-colors font-medium text-cyan-400">
                  Altium Develop Learning Hub
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAltiumLink('Altium Official Site', 'https://www.altium.com')} className="hover:text-amber-400 transition-colors flex items-center space-x-1">
                  <span>Altium Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAltiumLink('Altium Free Trial', 'https://www.altium.com/free-trial')} className="hover:text-amber-400 transition-colors flex items-center space-x-1">
                  <span>Start Altium Evaluation</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Intelligence, Legal & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">About & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('myActivity')} className="hover:text-brand-bright transition-colors font-medium text-cyan-300">
                  My Activity (this browser)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('insights')} className="hover:text-brand-bright transition-colors">
                  Site Insights (PostHog / GA4)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-brand-bright transition-colors">
                  About This Library
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('privacy')} className="hover:text-brand-bright transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('changelog')} className="hover:text-brand-bright transition-colors">
                  Changelog
                </button>
              </li>
              <li>
                <a href="mailto:contact@eduengteam.com" className="hover:text-brand-bright transition-colors flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>contact@eduengteam.com</span>
                </a>
              </li>
              <li>
                <ReportContentControl />
              </li>
            </ul>
          </div>

        </div>

        {/* Required Independent Disclaimer & Trademark Notice */}
        <div className="pt-8 border-t border-slate-800/80 bg-slate-900/40 p-6 rounded-xl border border-amber-900/40 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-medium text-xs">
            <Shield className="w-4 h-4 shrink-0" />
            <span>Required Legal & Trademark Attribution</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            <strong>Independent Publication Disclaimer:</strong> The EET Electronics Product Development Library is an independent educational publication and is not affiliated with, authorized, sponsored, or otherwise approved by Altium LLC.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>Trademark Notice:</strong> Altium, Altium Designer, Altium 365, and Altium Develop are trademarks or registered trademarks of Altium LLC or its affiliates in the United States and other countries. All other product names, logos, and brands are property of their respective owners.
          </p>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Educational Engineering Team (EET). All rights reserved.</p>
          <p className="flex items-center gap-3 text-slate-400">
            <button
              type="button"
              onClick={() => setActiveTab('changelog')}
              className="hover:text-brand-bright transition-colors font-mono"
            >
              {APP_STAGE_LABEL} v{APP_VERSION}
            </button>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Built for hardware developers</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
