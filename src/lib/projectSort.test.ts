import { describe, it, expect } from 'vitest';
import { sortProjects, folderNumber } from './projectSort';

interface TestProject {
  name: string;
  title: string;
  year: string;
}

const P = (name: string, title: string, year = '2025'): TestProject => ({ name, title, year });

describe('folderNumber', () => {
  it('extracts the numeric prefix', () => {
    expect(folderNumber('006-Maaya-Nizhal')).toBe(6);
    expect(folderNumber('001-Pulse-Magazine')).toBe(1);
    expect(folderNumber('no-number')).toBeNaN();
  });
});

describe('sortProjects', () => {
  const projects = [
    P('001-Pulse-Magazine', 'Pulse Magazine', '2025'),
    P('006-Maaya-Nizhal', 'Maaya Nizhal', '2026'),
    P('005-Miracle-Kathakal-25', 'Miracle Kathakal - 25', '2026'),
    P('003-Watch-Ninna-Samayam', 'Watch Ninna Samayam', '2025'),
  ];

  it('sorts newest first by folder number', () => {
    const sorted = sortProjects(projects, 'newest');
    expect(sorted.map(p => p.name)).toEqual([
      '006-Maaya-Nizhal',
      '005-Miracle-Kathakal-25',
      '003-Watch-Ninna-Samayam',
      '001-Pulse-Magazine',
    ]);
  });

  it('sorts oldest first by folder number', () => {
    const sorted = sortProjects(projects, 'oldest');
    expect(sorted[0].name).toBe('001-Pulse-Magazine');
    expect(sorted[sorted.length - 1].name).toBe('006-Maaya-Nizhal');
  });

  it('sorts alphabetically by title', () => {
    const sorted = sortProjects(projects, 'name');
    expect(sorted[0].title).toBe('Maaya Nizhal');
  });

  it('sorts by year (newest year first), then title', () => {
    const sorted = sortProjects(projects, 'year');
    expect(sorted[0].year).toBe('2026');
  });

  it('gives the latest four projects when sliced after newest-first sort', () => {
    const latest4 = sortProjects(projects, 'newest').slice(0, 4).map(p => p.name);
    expect(latest4).toContain('006-Maaya-Nizhal');
    expect(latest4).toContain('005-Miracle-Kathakal-25');
    expect(latest4).toContain('003-Watch-Ninna-Samayam');
    expect(latest4).toContain('001-Pulse-Magazine');
    // highest-numbered (newest) project is first
    expect(latest4[0]).toBe('006-Maaya-Nizhal');
  });

  it('does not mutate the input array', () => {
    const copy = [...projects];
    sortProjects(projects, 'newest');
    expect(projects.map(p => p.name)).toEqual(copy.map(p => p.name));
  });
});
