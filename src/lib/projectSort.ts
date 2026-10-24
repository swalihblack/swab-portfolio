export type ProjectSortKey = 'newest' | 'oldest' | 'name' | 'year';

export interface SortableProject {
  name: string;
  title: string;
  year: string;
}

/** Numeric prefix of a folder name, e.g. "006-Maaya-Nizhal" → 6. NaN when absent. */
export function folderNumber(name: string): number {
  const m = name.match(/\d+/);
  return m ? parseInt(m[0], 10) : NaN;
}

function numCmp(a: number, b: number): number {
  const aN = Number.isNaN(a);
  const bN = Number.isNaN(b);
  if (aN && bN) return 0;
  if (aN) return 1;
  if (bN) return -1;
  return a - b;
}

/**
 * Sorts projects by the chosen key. Folder numbering defines recency
 * (higher number = newer); falls back to folder name, then title.
 */
export function sortProjects<T extends SortableProject>(projects: T[], sort: ProjectSortKey): T[] {
  const arr = [...projects];
  const num = (p: T) => folderNumber(p.name);
  const yearOf = (p: T) => parseInt(p.year, 10) || 0;
  switch (sort) {
    case 'newest':
      arr.sort((a, b) => numCmp(num(b), num(a)) || a.name.localeCompare(b.name));
      break;
    case 'oldest':
      arr.sort((a, b) => numCmp(num(a), num(b)) || a.name.localeCompare(b.name));
      break;
    case 'name':
      arr.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'year':
      arr.sort((a, b) => yearOf(b) - yearOf(a) || a.title.localeCompare(b.title));
      break;
  }
  return arr;
}
