import type { Project } from '@/hooks/useGitHubPortfolio';

const GITHUB_RAW = 'https://raw.githubusercontent.com/swalihblack/swab-portfolio/main';

export const fallbackProjects: Project[] = [
  {
    name: '001-Pulse-Magazine',
    title: 'PULSE Magazine',
    subtitle: 'Typesetting, Layout & Cover',
    description:
      'I handled the complete visual execution of this student union magazine—from typesetting manuscripts contributed by multiple student authors to designing the interior layout and cover. The goal was to create a clean, professional publication that reflects the energy of the student body while maintaining clarity and consistency across diverse content.',
    year: '2024',
    client: 'Atharva College Union',
    tools: ['Illustrator', 'Photoshop', 'InDesign', 'MS Word', 'ChatGPT'],
    links: [
      { label: 'GDrive', url: 'https://drive.google.com/file/d/11kRZEadkkgz-l1Lovc1Rdlc1g4sd2nGB/view?usp=drive_link' },
      { label: 'Preview', url: 'https://online.fliphtml5.com/dctmb/kmbl' },
    ],
    coverUrl: `${GITHUB_RAW}/projects/001-Pulse-Magazine/cover.webp`,
    photos: [],
    folderUrl: 'https://github.com/swalihblack/swab-portfolio/tree/main/projects/001-Pulse-Magazine',
  },
  {
    name: '002-Kuruvikalude-Republic',
    title: 'Kuruvikalude Republic',
    subtitle: 'Cover Design',
    description:
      'I designed the cover for this novel, creating a visual identity that reflects the tone and themes of the story. Working closely with the publisher, I developed a concept that balances literary sensibility with market appeal, resulting in a distinctive cover tailored for the target readership.',
    year: '2025',
    client: 'Miracle Books',
    tools: ['Illustrator', 'Photoshop', 'ChatGPT'],
    links: [{ label: 'Instagram', url: 'https://www.instagram.com/swalihblack' }],
    coverUrl: `${GITHUB_RAW}/projects/002-Kuruvikalude-Republic/cover.webp`,
    photos: [],
    folderUrl: 'https://github.com/swalihblack/swab-portfolio/tree/main/projects/002-Kuruvikalude-Republic',
  },
  {
    name: '003-Watch-Ninna-Samayam',
    title: 'Watch Ninna Samayam',
    subtitle: 'Cover Design',
    description:
      'I designed the cover for this gothic‑themed novel, crafting a visual identity that reflects its atmospheric tone—dark, haunting, and centered on a young protagonist. The final cover balances literary mood with market appeal, creating an evocative entry point for readers.',
    year: '2025',
    client: 'Pusthakasadya',
    tools: ['Illustrator', 'Photoshop', 'ChatGPT'],
    links: [{ label: 'Instagram', url: 'https://www.instagram.com/swalihblack' }],
    coverUrl: `${GITHUB_RAW}/projects/003-Watch-Ninna-Samayam/cover.webp`,
    photos: [],
    folderUrl: 'https://github.com/swalihblack/swab-portfolio/tree/main/projects/003-Watch-Ninna-Samayam',
  },
  {
    name: '004-Ramadan-Campaign',
    title: 'Ramadan Campaign',
    subtitle: 'Poster Design',
    description:
      'I designed a series of posters for the masjid\'s Ramadan campaign, creating a cohesive visual identity to promote events, daily prayers, and community initiatives throughout the holy month. The designs balance spiritual resonance with clear communication, ensuring information was accessible and visually engaging for the congregation.',
    year: '2026',
    client: 'Kanhirathingal Juma Masjid',
    tools: ['Photoshop', 'Nano Banana Pro', 'Google Flow'],
    links: [{ label: 'Instagram', url: 'https://www.instagram.com/swalihblack' }],
    coverUrl: `${GITHUB_RAW}/projects/004-Ramadan-Campaign/cover.webp`,
    photos: [`${GITHUB_RAW}/projects/004-Ramadan-Campaign/photo1.webp`],
    folderUrl: 'https://github.com/swalihblack/swab-portfolio/tree/main/projects/004-Ramadan-Campaign',
  },
];
