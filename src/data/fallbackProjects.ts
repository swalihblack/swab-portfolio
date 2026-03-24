import type { Project } from '@/hooks/useGitHubPortfolio';

export const fallbackProjects: Project[] = [
  {
    name: 'Brew-Brand-Identity',
    title: 'Brew Coffee Co.',
    subtitle: 'Brand Identity Design',
    description:
      'Complete brand identity system for an artisan coffee roastery, including logo design, packaging, menu layouts, and in-store collateral.',
    year: '2024',
    client: 'Brew Coffee Co.',
    tools: ['Illustrator', 'Photoshop', 'InDesign'],
    links: [
      { label: 'Behance', url: 'https://behance.net' },
      { label: 'Live Site', url: 'https://example.com' },
    ],
    coverUrl:
      'https://raw.githubusercontent.com/swalihblack/swab-portfolio/main/projects/Brew-Brand-Identity/cover.jpg',
    photos: [],
    folderUrl:
      'https://github.com/swalihblack/swab-portfolio/tree/main/projects/Brew-Brand-Identity',
  },
  {
    name: 'Soundwave-Festival-Poster',
    title: 'Soundwave Festival',
    subtitle: 'Event Poster & Campaign',
    description:
      'Bold poster series and promotional campaign for Soundwave Music Festival 2024.',
    year: '2024',
    client: 'Soundwave Events',
    tools: ['Photoshop', 'Illustrator', 'After Effects'],
    links: [{ label: 'Behance', url: 'https://behance.net' }],
    coverUrl:
      'https://raw.githubusercontent.com/swalihblack/swab-portfolio/main/projects/Soundwave-Festival-Poster/cover.jpg',
    photos: [],
    folderUrl:
      'https://github.com/swalihblack/swab-portfolio/tree/main/projects/Soundwave-Festival-Poster',
  },
  {
    name: 'Lexis-Law-Brochure',
    title: 'Lexis & Partners',
    subtitle: 'Corporate Brochure Design',
    description:
      'A sophisticated tri-fold brochure and digital PDF for a boutique law firm.',
    year: '2023',
    client: 'Lexis & Partners LLP',
    tools: ['InDesign', 'Photoshop', 'MS Word'],
    links: [{ label: 'PDF Preview', url: 'https://example.com' }],
    coverUrl:
      'https://raw.githubusercontent.com/swalihblack/swab-portfolio/main/projects/Lexis-Law-Brochure/cover.jpg',
    photos: [],
    folderUrl:
      'https://github.com/swalihblack/swab-portfolio/tree/main/projects/Lexis-Law-Brochure',
  },
];
