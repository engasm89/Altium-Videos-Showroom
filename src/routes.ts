/** Tab keys used across Navbar/Footer/views → public URL paths */

export const TAB_PATHS: Record<string, string> = {
  home: '/',
  catalog: '/tutorials',
  paths: '/learning-paths',
  projects: '/projects',
  products: '/products',
  roles: '/roles',
  personas: '/personas',
  skills: '/skills',
  myActivity: '/my-activity',
  insights: '/insights',
  about: '/about',
  privacy: '/privacy',
  changelog: '/changelog',
  altiumDevelop: '/altium-develop',
  workflow: '/workflow',
  compareWorkflows: '/compare-workflows',
  esp32CaseStudy: '/case-studies/esp32-product',
  shortcuts: '/tools/shortcuts',
  activebom: '/tools/activebom',
  drc: '/tools/drc',
  stackup: '/tools/stackup',
  notes: '/notes',
  glossary: '/glossary',
};

const PATH_TO_TAB: Record<string, string> = Object.fromEntries(
  Object.entries(TAB_PATHS).map(([tab, path]) => [path, tab])
);

export function pathForTab(tab: string): string {
  return TAB_PATHS[tab] ?? '/';
}

/** Resolve pathname (no search) to a primary tab key. */
export function tabFromPathname(pathname: string): string {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/tutorials')) return 'catalog';
  if (pathname.startsWith('/learning-paths')) return 'paths';
  if (pathname.startsWith('/products')) return 'products';
  if (pathname.startsWith('/roles')) return 'roles';
  if (pathname.startsWith('/personas')) return 'personas';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/altium-develop')) return 'altiumDevelop';
  if (pathname.startsWith('/workflow')) return 'workflow';
  if (pathname.startsWith('/compare-workflows')) return 'compareWorkflows';
  if (pathname.startsWith('/case-studies')) return 'esp32CaseStudy';
  if (pathname.startsWith('/tools/shortcuts')) return 'shortcuts';
  if (pathname.startsWith('/tools/activebom')) return 'activebom';
  if (pathname.startsWith('/tools/drc')) return 'drc';
  if (pathname.startsWith('/tools/stackup')) return 'stackup';
  if (pathname.startsWith('/admin') || pathname.startsWith('/feedback-inbox')) return 'admin';
  // Legacy Impact URL → My Activity tab highlight while redirect runs
  if (pathname === '/impact') return 'myActivity';

  if (PATH_TO_TAB[pathname]) return PATH_TO_TAB[pathname];
  // Unknown paths render NotFoundView — do not pretend they are home.
  return 'notfound';
}
