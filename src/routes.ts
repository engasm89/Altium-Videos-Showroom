/** Tab keys used across Navbar/Footer/views → public URL paths */

export const TAB_PATHS: Record<string, string> = {
  home: '/',
  catalog: '/tutorials',
  paths: '/learning-paths',
  projects: '/projects',
  products: '/products',
  roles: '/roles',
  skills: '/skills',
  impact: '/impact',
  about: '/about',
  privacy: '/privacy',
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
  if (pathname.startsWith('/tutorials')) return 'catalog';
  if (pathname.startsWith('/learning-paths')) return 'paths';
  if (pathname.startsWith('/products')) return 'products';
  if (pathname.startsWith('/roles')) return 'roles';
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/tools/shortcuts')) return 'shortcuts';
  if (pathname.startsWith('/tools/activebom')) return 'activebom';
  if (pathname.startsWith('/tools/drc')) return 'drc';
  if (pathname.startsWith('/tools/stackup')) return 'stackup';

  return PATH_TO_TAB[pathname] ?? 'home';
}
