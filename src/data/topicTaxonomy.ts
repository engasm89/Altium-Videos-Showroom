/**
 * Structured topic hubs for Designer + Develop.
 * Each topic opens the catalog filtered by product + search query
 * (title/description match against data/videos.csv — not invented counts).
 */

export interface CatalogTopic {
  id: string;
  label: string;
  /** Search query applied with product filter */
  query: string;
  blurb: string;
}

export const DESIGNER_TOPICS: CatalogTopic[] = [
  {
    id: 'getting-started',
    label: 'Getting started',
    query: 'install',
    blurb: 'Download, setup, UI, and first project navigation',
  },
  {
    id: 'schematics',
    label: 'Schematics',
    query: 'schematic',
    blurb: 'Capture, wiring, sheets, and ERC',
  },
  {
    id: 'libraries',
    label: 'Libraries',
    query: 'library',
    blurb: 'SchLib/PcbLib, DB libraries, and part catalogs',
  },
  {
    id: 'footprints',
    label: 'Footprints',
    query: 'footprint',
    blurb: 'IPC footprints, pad stacks, and 3D models',
  },
  {
    id: 'pcb-layout',
    label: 'PCB layout',
    query: 'pcb layout',
    blurb: 'Placement, stackup, and board setup',
  },
  {
    id: 'routing',
    label: 'Routing',
    query: 'routing',
    blurb: 'Interactive routing, pours, and differential pairs',
  },
  {
    id: 'design-rules',
    label: 'Design rules',
    query: 'design rules',
    blurb: 'Clearance, DRC, and rule-driven layout',
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    query: 'gerber',
    blurb: 'Outputs, Gerber/ODB++, and fab handoff',
  },
  {
    id: 'complete-projects',
    label: 'Complete projects',
    query: 'arduino',
    blurb: 'End-to-end board walkthroughs from the catalog',
  },
];

export const DEVELOP_TOPICS: CatalogTopic[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    query: 'workspace',
    blurb: 'Team workspace setup and navigation',
  },
  {
    id: 'search',
    label: 'Search',
    query: 'search',
    blurb: 'Find design data across the connected hub',
  },
  {
    id: 'reviews',
    label: 'Reviews & comments',
    query: 'review',
    blurb: 'Browser markup, comments, and design intent',
  },
  {
    id: 'version-history',
    label: 'Version history',
    query: 'version',
    blurb: 'Hardware version control and revision history',
  },
  {
    id: 'project-management',
    label: 'Project management',
    query: 'project',
    blurb: 'Project hubs and team coordination',
  },
  {
    id: 'requirements',
    label: 'Requirements',
    query: 'requirements',
    blurb: 'PRD linkage and verification traceability',
  },
  {
    id: 'bom-supply',
    label: 'BOM & supply',
    query: 'bom',
    blurb: 'ActiveBOM, lifecycle, and supplier feedback',
  },
  {
    id: 'ecad-mcad',
    label: 'ECAD–MCAD',
    query: 'solidworks',
    blurb: 'Mechanical sync and co-design handoffs',
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing',
    query: 'manufacturing',
    blurb: 'Release and fab-facing Develop workflows',
  },
  {
    id: 'eng-management',
    label: 'Eng management',
    query: 'management',
    blurb: 'Leadership visibility and release gates',
  },
];

/** Primary paths shown in homepage / paths hero (featured flag in learningPaths.ts). */
export const PRIMARY_PATH_LIMIT = 7;
