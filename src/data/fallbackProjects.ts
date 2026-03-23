import type { Project } from '@/hooks/useGitHubPortfolio';

/**
 * Local fallback projects shown when the GitHub API is unavailable.
 * Keep this in sync with your /projects folder in the repo.
 */
export const fallbackProjects: Project[] = [
  {
    name: 'Brew-Brand-Identity',
    title: 'Brew Coffee Co.',
    subtitle: 'Brand Identity Design',
    description:
      'Complete brand identity system for an artisan coffee roastery, including logo design, packaging, menu layouts, and in-store collateral. The warm, earthy palette reflects the handcrafted nature of the product while maintaining a modern, approachable feel.',
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
      'Bold poster series and promotional campaign for Soundwave Music Festival 2024. The geometric design language and high-contrast color scheme were crafted to stand out in both digital ads and large-format print across the city.',
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
      'A sophisticated tri-fold brochure and digital PDF for a boutique law firm. The design balances professionalism with accessibility, using a restrained navy-and-gold palette and clear typographic hierarchy to guide prospective clients through the firm's practice areas.',
    tools: ['InDesign', 'Photoshop', 'MS Word'],
    links: [{ label: 'PDF Preview', url: 'https://example.com' }],
    coverUrl:
      'https://raw.githubusercontent.com/swalihblack/swab-portfolio/main/projects/Lexis-Law-Brochure/cover.jpg',
    photos: [],
    folderUrl:
      'https://github.com/swalihblack/swab-portfolio/tree/main/projects/Lexis-Law-Brochure',
  },
];
