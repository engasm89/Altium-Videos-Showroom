import { Tutorial } from '../types';
import { isPlayableTutorial } from '../data/catalog';

/** Inject / refresh JSON-LD VideoObject for playable tutorials. */
export function upsertVideoJsonLd(tutorial: Tutorial | null): void {
  const id = 'eet-video-jsonld';
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!tutorial || !isPlayableTutorial(tutorial)) return;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: tutorial.title,
    description: tutorial.shortDescription,
    thumbnailUrl: `https://i.ytimg.com/vi/${tutorial.youtubeId}/hqdefault.jpg`,
    uploadDate: tutorial.publishedDate,
    embedUrl: `https://www.youtube.com/embed/${tutorial.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${tutorial.youtubeId}`,
    publisher: {
      '@type': 'Organization',
      name: 'Educational Engineering Team',
    },
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.text = JSON.stringify(data);
  document.head.appendChild(script);
}
