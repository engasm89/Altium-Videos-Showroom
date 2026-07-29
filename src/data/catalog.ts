import { Tutorial, YoutubeStatus, EnrichmentStatus } from '../types';
import { isPlayableYoutubeId } from '../utils/youtube';
import { CURATED_ENRICHMENT } from './curatedEnrichment';
import generated from './catalog.generated.json';

export type CatalogGeneratedRow = {
  id: string;
  catalogNumber: number;
  youtubeId: string;
  youtubeUrl?: string | null;
  youtubeStatus: YoutubeStatus;
  enrichmentStatus: EnrichmentStatus;
  urlType?: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullSummary: string;
  durationSeconds: number;
  durationFormatted: string;
  publishedDate: string;
  product: Tutorial['product'];
  difficulty: Tutorial['difficulty'];
  role: Tutorial['role'];
  skills: string[];
  projectId?: string;
  learningPathIds: string[];
  chapters: Tutorial['chapters'];
  featured?: boolean;
  series?: string;
  evidenceClass?: string;
  liveStatus?: string;
  sourceNotes?: string;
  yearEra?: string;
  month?: string;
  oembedTitle?: string;
  oembedAuthor?: string;
  oembedError?: string;
  officialDocUrl?: string;
  altiumTrialUrl?: string;
};

/** Topic fallbacks for curated outline-only lessons (no verified YT ID). */
const PENDING_TOPIC_TARGETS: Record<string, string> = {
  'eet_pending_001': 'cat-001', // Install Altium 2022
  'eet_pending_008': 'cat-133', // Buck Converter PCB Layout
  'eet_pending_011': 'cat-125', // BOM / supply chain in Develop
  'eet_pending_012': 'cat-140', // ECAD-MCAD collaboration
  'eet_pending_014': 'cat-002', // ESP32 PCB design
  'eet_pending_015': 'cat-244', // Manufacturing outputs Arduino
};

function rowToTutorial(row: CatalogGeneratedRow): Tutorial {
  return {
    id: row.id,
    youtubeId: row.youtubeId,
    title: row.title,
    slug: row.slug,
    shortDescription: row.shortDescription,
    fullSummary: row.fullSummary,
    durationSeconds: row.durationSeconds,
    durationFormatted: row.durationFormatted,
    publishedDate: row.publishedDate,
    product: row.product,
    difficulty: row.difficulty,
    role: row.role,
    skills: row.skills,
    projectId: row.projectId,
    learningPathIds: row.learningPathIds,
    chapters: row.chapters || [],
    featured: row.featured,
    officialDocUrl: row.officialDocUrl,
    altiumTrialUrl: row.altiumTrialUrl,
    youtubeStatus: row.youtubeStatus,
    enrichmentStatus: row.enrichmentStatus,
    youtubeUrl: row.youtubeUrl || undefined,
    catalogNumber: row.catalogNumber,
    series: row.series,
    evidenceClass: row.evidenceClass,
    liveStatus: row.liveStatus,
    oembedTitle: row.oembedTitle,
    oembedAuthor: row.oembedAuthor,
  };
}

function mergeEnrichment(base: Tutorial, overlay: Tutorial): Tutorial {
  return {
    ...base,
    // Keep honest sheet title / ID / status; overlay pedagogical depth.
    shortDescription: overlay.shortDescription || base.shortDescription,
    fullSummary: overlay.fullSummary || base.fullSummary,
    durationSeconds: overlay.durationSeconds || base.durationSeconds,
    durationFormatted:
      overlay.durationSeconds > 0 ? overlay.durationFormatted : base.durationFormatted,
    difficulty: overlay.difficulty || base.difficulty,
    role: overlay.role || base.role,
    skills: overlay.skills?.length ? overlay.skills : base.skills,
    projectId: overlay.projectId || base.projectId,
    learningPathIds: Array.from(
      new Set([...(overlay.learningPathIds || []), ...(base.learningPathIds || [])])
    ),
    chapters: overlay.chapters?.length ? overlay.chapters : base.chapters,
    transcript: overlay.transcript,
    commands: overlay.commands,
    resources: overlay.resources,
    softwareVersion: overlay.softwareVersion,
    featured: overlay.featured || base.featured,
    enrichmentStatus:
      overlay.chapters?.length || overlay.transcript?.length
        ? 'hand_enriched'
        : base.enrichmentStatus,
    legacyIds: Array.from(new Set([...(base.legacyIds || []), overlay.id])),
  };
}

const generatedRows = (generated.tutorials as CatalogGeneratedRow[]) || [];
const byId = new Map(generatedRows.map((r) => [r.id, rowToTutorial(r)]));
const byYoutubeId = new Map<string, Tutorial>();
for (const t of byId.values()) {
  if (isPlayableYoutubeId(t.youtubeId)) {
    byYoutubeId.set(t.youtubeId, t);
  }
}

/** Legacy tut-* → imported cat-* for paths/roles/projects. */
export const LEGACY_TUTORIAL_ID_MAP: Record<string, string> = {};

for (const overlay of CURATED_ENRICHMENT) {
  let target: Tutorial | undefined;

  if (isPlayableYoutubeId(overlay.youtubeId)) {
    target = byYoutubeId.get(overlay.youtubeId);
  } else if (PENDING_TOPIC_TARGETS[overlay.youtubeId]) {
    target = byId.get(PENDING_TOPIC_TARGETS[overlay.youtubeId]);
  }

  if (!target) continue;

  LEGACY_TUTORIAL_ID_MAP[overlay.id] = target.id;
  const merged = mergeEnrichment(target, overlay);
  byId.set(target.id, merged);
  if (isPlayableYoutubeId(merged.youtubeId)) {
    byYoutubeId.set(merged.youtubeId, merged);
  }
}

export const CATALOG_ENRICHMENT_GOAL = 333;
export const CATALOG_IMPORT_META = generated.meta;

/** Full imported catalog with enrichment overlays where available. */
export const ALL_TUTORIALS: Tutorial[] = [...byId.values()].sort(
  (a, b) => (a.catalogNumber || 0) - (b.catalogNumber || 0)
);

/** @deprecated Prefer ALL_TUTORIALS — kept for older imports. */
export const TUTORIALS_CATALOG = ALL_TUTORIALS;

export function resolveTutorialId(id: string): string {
  return LEGACY_TUTORIAL_ID_MAP[id] || id;
}

export function findTutorialById(id: string): Tutorial | undefined {
  const resolved = resolveTutorialId(id);
  return ALL_TUTORIALS.find((t) => t.id === resolved || t.legacyIds?.includes(id));
}

export function isPlayableTutorial(tutorial: Tutorial): boolean {
  if (!isPlayableYoutubeId(tutorial.youtubeId)) return false;
  // Only treat oEmbed-confirmed public EET uploads as playable embeds.
  if (tutorial.youtubeStatus && tutorial.youtubeStatus !== 'public') return false;
  return true;
}

export const PLAYABLE_TUTORIALS = ALL_TUTORIALS.filter(isPlayableTutorial);

export const catalogCounts = {
  total: ALL_TUTORIALS.length,
  enriched: ALL_TUTORIALS.filter((t) => t.enrichmentStatus === 'hand_enriched').length,
  playable: PLAYABLE_TUTORIALS.length,
  playableCandidates: PLAYABLE_TUTORIALS.length,
  withYoutubeId: ALL_TUTORIALS.filter((t) => isPlayableYoutubeId(t.youtubeId)).length,
  playlistOnly: ALL_TUTORIALS.filter((t) => t.youtubeStatus === 'playlist_only').length,
  missing: ALL_TUTORIALS.filter(
    (t) => t.youtubeStatus === 'missing' || t.youtubeStatus === 'invalid'
  ).length,
  unverified: ALL_TUTORIALS.filter((t) => t.youtubeStatus === 'unverified').length,
  enrichmentGoal: CATALOG_ENRICHMENT_GOAL,
  designer: ALL_TUTORIALS.filter((t) => t.product === 'Altium Designer').length,
  develop: ALL_TUTORIALS.filter((t) => t.product === 'Altium Develop').length,
  otherAdjacent: ALL_TUTORIALS.filter((t) => t.product === 'Other / Adjacent').length,
};
