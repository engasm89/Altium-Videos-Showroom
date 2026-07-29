import { Tutorial } from '../types';

/** Optional hand-authored freshness overlay keyed by catalog tutorial id. */
export interface ContentFreshnessOverlay {
  recordedDate?: string;
  lastVerifiedDate?: string;
  softwareVersion?: string;
  featureAvailability?: string;
  stillCurrent?: boolean;
}

/**
 * Explicit verification metadata for hand-enriched / strategically important lessons.
 * Do not invent dates for the bulk catalog — only show indicators where data exists.
 */
export const CONTENT_FRESHNESS_BY_ID: Record<string, ContentFreshnessOverlay> = {
  // Resolved via youtube overlay merge — also keyed by common legacy/enriched targets below.
};

/** Per curated youtubeId / legacy id — applied when catalog merge finds the row. */
export const CONTENT_FRESHNESS_BY_YOUTUBE: Record<string, ContentFreshnessOverlay> = {
  zFOiYNcBVEY: {
    recordedDate: '2024-01-20',
    lastVerifiedDate: '2026-06-01',
    softwareVersion: 'AD24.1',
    featureAvailability: 'Project structure & document hierarchy still current in AD24/AD25',
    stillCurrent: true,
  },
  GybRq75o7g8: {
    recordedDate: '2024-02-01',
    lastVerifiedDate: '2026-06-01',
    softwareVersion: 'AD24.2',
    featureAvailability: 'Symbol editor & pin electrical types still current',
    stillCurrent: true,
  },
  t6ePVpeCLxw: {
    recordedDate: '2024-02-10',
    lastVerifiedDate: '2026-06-01',
    softwareVersion: 'AD24.2',
    featureAvailability: 'IPC footprint wizard workflow still current',
    stillCurrent: true,
  },
  'jv-m0xkAFck': {
    recordedDate: '2024-03-20',
    lastVerifiedDate: '2026-07-01',
    softwareVersion: 'Develop 2025',
    featureAvailability: 'Develop workspace tour & multidisciplinary hubs still current',
    stillCurrent: true,
  },
  'Noxk9jw-3rs': {
    recordedDate: '2024-03-28',
    lastVerifiedDate: '2026-07-01',
    softwareVersion: 'Develop 2025',
    featureAvailability: 'Requirements linking concepts still current in Develop',
    stillCurrent: true,
  },
};

export interface ContentFreshnessDisplay {
  recordedDate?: string;
  lastVerifiedDate?: string;
  softwareVersion?: string;
  featureAvailability?: string;
  stillCurrent?: boolean;
  /** True when at least one indicator can be shown. */
  hasAny: boolean;
}

/** Build display-ready freshness from tutorial fields + overlays — never invent missing facts. */
export function getContentFreshness(tutorial: Tutorial): ContentFreshnessDisplay {
  const byId = CONTENT_FRESHNESS_BY_ID[tutorial.id];
  const byYt = isRealYoutube(tutorial.youtubeId)
    ? CONTENT_FRESHNESS_BY_YOUTUBE[tutorial.youtubeId]
    : undefined;

  const explicitRecorded =
    tutorial.recordedDate || byId?.recordedDate || byYt?.recordedDate || undefined;
  const lastVerifiedDate =
    tutorial.lastVerifiedDate || byId?.lastVerifiedDate || byYt?.lastVerifiedDate || undefined;
  const softwareVersion =
    tutorial.softwareVersion || byId?.softwareVersion || byYt?.softwareVersion || undefined;
  const featureAvailability =
    tutorial.featureAvailability ||
    byId?.featureAvailability ||
    byYt?.featureAvailability ||
    undefined;
  const stillCurrent =
    tutorial.stillCurrent ?? byId?.stillCurrent ?? byYt?.stillCurrent ?? undefined;

  // Show recorded when explicitly set, or when we already have richer freshness signals
  // (then fall back to publishedDate so the strip is self-contained).
  const richer =
    Boolean(lastVerifiedDate) ||
    Boolean(softwareVersion) ||
    Boolean(featureAvailability) ||
    stillCurrent !== undefined;
  const recordedDate = explicitRecorded || (richer ? tutorial.publishedDate || undefined : undefined);

  const hasAny = Boolean(
    recordedDate || lastVerifiedDate || softwareVersion || featureAvailability || stillCurrent !== undefined
  );

  return {
    recordedDate,
    lastVerifiedDate,
    softwareVersion,
    featureAvailability,
    stillCurrent,
    hasAny,
  };
}

function isRealYoutube(id: string): boolean {
  return Boolean(id) && !id.startsWith('eet_') && id.length >= 8;
}
