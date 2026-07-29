export type ProductType = 'Altium Designer' | 'Altium Develop' | 'Altium 365' | 'CircuitMaker';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type RoleCategory = 
  | 'Hardware & PCB Engineering'
  | 'Procurement & Components'
  | 'Manufacturing & Quality'
  | 'Product & Applications'
  | 'Engineering Leadership'
  | 'Compliance & Sustainability';

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

export interface DownloadResource {
  title: string;
  type: 'Schematic' | 'BOM' | 'Gerber' | 'Guide' | 'Datasheet' | 'Project File';
  url: string;
  size?: string;
}

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
  product: ProductType;
  softwareVersion?: string;
  difficulty: DifficultyLevel;
  role: RoleCategory;
  skills: string[];
  projectId?: string;
  learningPathIds: string[];
  chapters: Chapter[];
  transcript?: TranscriptLine[];
  commands?: CommandShortcut[];
  resources?: DownloadResource[];
  officialDocUrl?: string;
  altiumTrialUrl?: string;
  viewsCount?: number;
  featured?: boolean;
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
