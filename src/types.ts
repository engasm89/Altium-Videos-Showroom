export type ProductType =
  | 'Altium Designer'
  | 'Altium Develop'
  | 'Altium 365'
  | 'CircuitMaker'
  | 'Other / Adjacent';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type RoleCategory = 
  | 'Hardware & PCB Engineering'
  | 'Procurement & Components'
  | 'Manufacturing & Quality'
  | 'Product & Applications'
  | 'Engineering Leadership'
  | 'Compliance & Sustainability';

/** Honest playback / recovery status from spreadsheet + oEmbed validation. */
export type YoutubeStatus =
  | 'public'
  | 'unverified'
  | 'unavailable'
  | 'missing'
  | 'playlist_only'
  | 'invalid'
  | 'id_present';

export type EnrichmentStatus =
  | 'enriched'
  | 'hand_enriched'
  | 'playable_candidate'
  | 'url_recovered'
  | 'url_recovered_unverified'
  | 'enrichment_pending';

/** Honest label: full captions vs pedagogical outline when verbatim transcript is unavailable. */
export type TranscriptKind = 'verbatim' | 'outline';

export interface Chapter {
  timestampSeconds: number;
  timestampFormatted: string;
  title: string;
  description?: string;
}

export interface TranscriptLine {
  timestampSeconds: number;
  timestampFormatted: string;
  text: string;
}

export interface CommandShortcut {
  key: string;
  action: string;
  context: 'Schematic' | 'PCB' | 'Develop' | 'General';
}

export interface ProceduralStep {
  step: number;
  title: string;
  detail: string;
}

export interface OfficialDocLink {
  title: string;
  url: string;
}

export interface DownloadResource {
  title: string;
  type: 'Schematic' | 'BOM' | 'Gerber' | 'Guide' | 'Datasheet' | 'Project File';
  url: string;
  size?: string;
}

/** Product-development stage this lesson primarily teaches. */
export type WorkflowStage =
  | 'Workspace Setup'
  | 'Multidisciplinary Collaboration'
  | 'Requirements'
  | 'Traceability'
  | 'Project Visibility'
  | 'Design Reviews'
  | 'BOM & Supply Risk'
  | 'Procurement'
  | 'Manufacturing Handoff'
  | 'Verification & Compliance'
  | 'ECAD–MCAD'
  | 'Engineering Management';

export interface Tutorial {
  id: string;
  /** Real YouTube ID when known; synthetic placeholders must not be treated as playable. */
  youtubeId: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullSummary: string;
  durationSeconds: number;
  durationFormatted: string;
  publishedDate: string;
  /** Explicit record date when different from publishedDate; otherwise UI may use publishedDate. */
  recordedDate?: string;
  /** Last date EET verified the workflow against current Altium UI. */
  lastVerifiedDate?: string;
  /** Honest “still current” flag — only set when verified; omit when unknown. */
  stillCurrent?: boolean;
  /** Short note on which features remain available / accurate. */
  featureAvailability?: string;
  product: ProductType;
  softwareVersion?: string;
  difficulty: DifficultyLevel;
  role: RoleCategory;
  skills: string[];
  projectId?: string;
  learningPathIds: string[];
  chapters: Chapter[];
  transcript?: TranscriptLine[];
  /** When 'outline', UI must label content as a high-quality outline — not a full caption dump. */
  transcriptKind?: TranscriptKind;
  commands?: CommandShortcut[];
  /** Ordered how-to steps when hotkeys alone are not enough (Develop workflows). */
  proceduralSteps?: ProceduralStep[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  workflowStage?: WorkflowStage | string;
  /** Catalog id of the next recommended lesson in a Develop learning sequence. */
  nextRecommendedLessonId?: string;
  resources?: DownloadResource[];
  officialDocUrl?: string;
  /** Multiple related official docs (preferred over a single URL when present). */
  officialDocLinks?: OfficialDocLink[];
  altiumTrialUrl?: string;
  /** CTA button label for Altium evaluation / product trial. */
  altiumCtaLabel?: string;
  /** @deprecated Never invent view counts — kept optional only for type compatibility. */
  viewsCount?: number;
  featured?: boolean;
  youtubeStatus?: YoutubeStatus;
  enrichmentStatus?: EnrichmentStatus;
  youtubeUrl?: string;
  catalogNumber?: number;
  series?: string;
  evidenceClass?: string;
  liveStatus?: string;
  oembedTitle?: string;
  oembedAuthor?: string;
  /** Prior tut-* ids that map onto this imported row. */
  legacyIds?: string[];
}

export function isPedagogicallyEnriched(status?: EnrichmentStatus): boolean {
  return status === 'enriched' || status === 'hand_enriched';
}

export interface LearningPathModule {
  id: string;
  title: string;
  description: string;
  tutorialIds: string[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  headline: string;
  outcome: string;
  targetRole: RoleCategory;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  tutorialCount: number;
  iconName: string;
  modules: LearningPathModule[];
  skillsAcquired: string[];
  prerequisites: string[];
  featured?: boolean;
}

export interface EngineeringRole {
  id: string;
  slug: string;
  title: string;
  category: RoleCategory;
  description: string;
  keyResponsibilities: string[];
  primaryWorkflows: string[];
  recommendedPathId: string;
  tutorialIds: string[];
  iconName: string;
}

/** Develop-focused persona journey (outcome-led; distinct from catalog Role hubs). */
export interface PersonaJourney {
  id: string;
  slug: string;
  /** Short label for the “I am a …” selector */
  selectorLabel: string;
  title: string;
  audience: string;
  iconName: string;
  /** Business outcomes Altium Develop addresses for this audience */
  developOutcomes: string[];
  recommendedPathId: string;
  /** 3–6 curated tutorial IDs */
  tutorialIds: string[];
  workflowExample: {
    title: string;
    narrative: string;
    steps: string[];
  };
  relevantTool: {
    /** Tab key for pathForTab() */
    tab: string;
    label: string;
    description: string;
  };
  ctaLabel: string;
  /** utm_content value on outbound trial CTA */
  utmContent: string;
  /** Optional bridge to the catalog Roles taxonomy */
  relatedRoleSlug?: string;
}

export interface HardwareProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  category: string;
  schematicStatus: string;
  pcbStatus: string;
  bomStatus: string;
  tutorialIds: string[];
  downloadUrl?: string;
  githubUrl?: string;
}

export interface UserProgress {
  completedTutorials: string[]; // tutorial IDs
  bookmarkedTutorials: string[];
  completedPaths: string[];
  notes: Record<string, string>; // tutorialId -> note text
  outboundClicksCount: number;
  lastWatchedTutorialId?: string;
  lastWatchedPositionSeconds?: number;
}

export interface SearchFilterState {
  query: string;
  product: ProductType | 'All';
  role: RoleCategory | 'All';
  difficulty: DifficultyLevel | 'All';
  skill: string | 'All';
  learningPathId: string | 'All';
  projectId: string | 'All';
  durationRange: 'All' | '< 5 min' | '5-15 min' | '15+ min';
  sortBy: 'relevance' | 'newest' | 'duration' | 'popular';
}

export interface OutboundClickLog {
  id: string;
  tutorialId: string;
  tutorialTitle: string;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  timestamp: string;
}

export interface SearchQueryLog {
  query: string;
  timestamp: string;
  resultCount: number;
}
