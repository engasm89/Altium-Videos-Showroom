import { UserProgress, OutboundClickLog, SearchQueryLog } from '../types';

const PROGRESS_KEY = 'eet_user_progress_v1';
const CLICK_LOGS_KEY = 'eet_outbound_click_logs_v1';
const SEARCH_LOGS_KEY = 'eet_search_query_logs_v1';

export function getInitialProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse user progress from localStorage', e);
  }
  return {
    completedTutorials: [],
    bookmarkedTutorials: [],
    completedPaths: [],
    notes: {},
    outboundClicksCount: 0,
  };
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save user progress', e);
  }
}

export function toggleCompletedTutorial(tutorialId: string): UserProgress {
  const current = getInitialProgress();
  const exists = current.completedTutorials.includes(tutorialId);
  const updatedTutorials = exists
    ? current.completedTutorials.filter(id => id !== tutorialId)
    : [...current.completedTutorials, tutorialId];

  const updated: UserProgress = {
    ...current,
    completedTutorials: updatedTutorials
  };
  saveUserProgress(updated);
  return updated;
}

export function toggleBookmarkedTutorial(tutorialId: string): UserProgress {
  const current = getInitialProgress();
  const exists = current.bookmarkedTutorials.includes(tutorialId);
  const updatedBookmarks = exists
    ? current.bookmarkedTutorials.filter(id => id !== tutorialId)
    : [...current.bookmarkedTutorials, tutorialId];

  const updated: UserProgress = {
    ...current,
    bookmarkedTutorials: updatedBookmarks
  };
  saveUserProgress(updated);
  return updated;
}

export function saveTutorialNote(tutorialId: string, noteText: string): UserProgress {
  const current = getInitialProgress();
  const updated: UserProgress = {
    ...current,
    notes: {
      ...current.notes,
      [tutorialId]: noteText
    }
  };
  saveUserProgress(updated);
  return updated;
}

export function logOutboundClick(tutorialId: string, tutorialTitle: string, destinationUrl: string): OutboundClickLog[] {
  const current = getInitialProgress();
  current.outboundClicksCount += 1;
  saveUserProgress(current);

  const newLog: OutboundClickLog = {
    id: `click-${Date.now()}`,
    tutorialId,
    tutorialTitle,
    destinationUrl,
    utmSource: 'eet_learning_hub',
    utmMedium: 'tutorial',
    utmCampaign: 'altium_develop_library',
    timestamp: new Date().toISOString()
  };

  let existingLogs: OutboundClickLog[] = [];
  try {
    const raw = localStorage.getItem(CLICK_LOGS_KEY);
    if (raw) existingLogs = JSON.parse(raw);
  } catch (e) {
    // fallback
  }

  const updatedLogs = [newLog, ...existingLogs].slice(0, 50);
  try {
    localStorage.setItem(CLICK_LOGS_KEY, JSON.stringify(updatedLogs));
  } catch (e) {
    //
  }

  return updatedLogs;
}

export function getOutboundClickLogs(): OutboundClickLog[] {
  try {
    const raw = localStorage.getItem(CLICK_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    //
  }
  return [];
}

export function logSearchQuery(query: string, resultCount: number): void {
  if (!query || query.trim().length < 2) return;
  const newLog: SearchQueryLog = {
    query: query.trim(),
    timestamp: new Date().toISOString(),
    resultCount
  };

  let existing: SearchQueryLog[] = [];
  try {
    const raw = localStorage.getItem(SEARCH_LOGS_KEY);
    if (raw) existing = JSON.parse(raw);
  } catch (e) {
    //
  }

  const updated = [newLog, ...existing].slice(0, 100);
  try {
    localStorage.setItem(SEARCH_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    //
  }
}

export function getSearchQueryLogs(): SearchQueryLog[] {
  try {
    const raw = localStorage.getItem(SEARCH_LOGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    //
  }
  return [];
}
