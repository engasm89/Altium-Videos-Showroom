import { Tutorial, SearchFilterState } from '../types';
import { logSearchQuery } from './storage';

const SYNONYM_MAP: Record<string, string[]> = {
  'rule check': ['drc', 'design-rule check', 'clearance'],
  'component package': ['footprint', 'pcb library', 'land pattern'],
  'symbol library': ['schematic library', 'schlib', 'symbol'],
  'parts list': ['bom', 'activebom', 'bill of materials'],
  'mechanical collaboration': ['ecad-mcad', 'codesigner', 'solidworks', 'fusion'],
  'revision': ['version control', 'history', 'git', 'release'],
  'supplier': ['procurement', 'sourcing', 'mouser', 'digikey', 'distributor'],
  'antenna': ['rf', '2.4ghz', 'wifi', 'bluetooth', 'microstrip'],
  'power supply': ['buck', 'regulator', 'switching', 'converter', 'dc-dc']
};

export function searchAndFilterTutorials(
  tutorials: Tutorial[],
  filters: SearchFilterState
): { results: Tutorial[]; totalMatches: number } {
  let filtered = [...tutorials];

  // 1. Text Search query
  if (filters.query && filters.query.trim().length > 0) {
    const rawQuery = filters.query.trim().toLowerCase();
    
    // Check synonyms
    const expandedTerms = [rawQuery];
    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (rawQuery.includes(key) || synonyms.some(s => rawQuery.includes(s))) {
        expandedTerms.push(key, ...synonyms);
      }
    }

    filtered = filtered.filter(tut => {
      const title = tut.title.toLowerCase();
      const shortDesc = tut.shortDescription.toLowerCase();
      const fullSum = tut.fullSummary.toLowerCase();
      const skills = tut.skills.map(s => s.toLowerCase()).join(' ');
      const product = tut.product.toLowerCase();
      const role = tut.role.toLowerCase();
      
      const chapterTitles = tut.chapters.map(c => c.title.toLowerCase()).join(' ');
      const transcriptText = (tut.transcript || []).map(t => t.text.toLowerCase()).join(' ');
      const commandText = (tut.commands || []).map(c => `${c.key} ${c.action}`).join(' ').toLowerCase();

      const searchableBlob = `${title} ${shortDesc} ${fullSum} ${skills} ${product} ${role} ${chapterTitles} ${transcriptText} ${commandText}`;

      return expandedTerms.some(term => searchableBlob.includes(term));
    });

    // Log query for search gap analysis
    logSearchQuery(filters.query, filtered.length);
  }

  // 2. Filter by Product
  if (filters.product !== 'All') {
    filtered = filtered.filter(t => t.product === filters.product);
  }

  // 3. Filter by Role
  if (filters.role !== 'All') {
    filtered = filtered.filter(t => t.role === filters.role);
  }

  // 4. Filter by Difficulty
  if (filters.difficulty !== 'All') {
    filtered = filtered.filter(t => t.difficulty === filters.difficulty);
  }

  // 5. Filter by Skill
  if (filters.skill !== 'All') {
    filtered = filtered.filter(t => t.skills.includes(filters.skill));
  }

  // 6. Filter by Learning Path
  if (filters.learningPathId !== 'All') {
    filtered = filtered.filter(t => t.learningPathIds.includes(filters.learningPathId));
  }

  // 7. Filter by Project
  if (filters.projectId !== 'All') {
    filtered = filtered.filter(t => t.projectId === filters.projectId);
  }

  // 8. Filter by Duration
  if (filters.durationRange !== 'All') {
    if (filters.durationRange === '< 5 min') {
      filtered = filtered.filter(t => t.durationSeconds < 300);
    } else if (filters.durationRange === '5-15 min') {
      filtered = filtered.filter(t => t.durationSeconds >= 300 && t.durationSeconds <= 900);
    } else if (filters.durationRange === '15+ min') {
      filtered = filtered.filter(t => t.durationSeconds > 900);
    }
  }

  // 9. Sort results
  if (filters.sortBy === 'newest') {
    filtered.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  } else if (filters.sortBy === 'duration') {
    filtered.sort((a, b) => b.durationSeconds - a.durationSeconds);
  } else if (filters.sortBy === 'popular') {
    filtered.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
  }

  return {
    results: filtered,
    totalMatches: filtered.length
  };
}

export function getAllSkillsList(tutorials: Tutorial[]): string[] {
  const skillSet = new Set<string>();
  tutorials.forEach(t => {
    t.skills.forEach(s => skillSet.add(s));
  });
  return Array.from(skillSet).sort();
}
