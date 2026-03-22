

## Portfolio Website for "swab" — Swalih Abdullah

A mobile-first, Material Design-inspired portfolio site built within the existing React + Tailwind stack, faithfully implementing the brand identity and dynamic GitHub portfolio feature.

### Brand & Design System
- **Colors:** Deep Navy Blue (#1a237e) primary, Burnt Orange (#ff6d00) accent, Off-White (#f5f5f0) background
- **Typography:** Playfair Display (headings) + Roboto (body) via Google Fonts
- **Material Design touches:** Card elevation/shadows, ripple effects on buttons, smooth transitions

### Page Sections (Single-Page Layout)
1. **Sticky Header** — "swab" logo, hamburger menu on mobile, smooth-scroll nav links
2. **Hero Section** — Bold tagline "Precision in Law. Creativity in Design.", "View Work" CTA
3. **About Section** — Bio (Law Student + Graphic Designer), tool icons (Ps, Ai, Id, MS Suite, AI)
4. **Portfolio Section** — Dynamic grid of Material Design cards fetched from GitHub API
5. **Contact Section** — Frontend-only contact form + direct email link
6. **Footer** — Copyright + social links

### Dynamic GitHub Portfolio
- Fetches `/projects` directory contents from a configured GitHub repo using the GitHub Content API
- Each subfolder = a project with `cover.jpg` and `details.txt`
- Renders Material Design cards with cover image, title, description, and "View Details" button
- Lazy-loads images for performance
- Graceful fallback message on API failure
- Comments explaining GitHub PAT setup for rate limit handling

### Technical Approach
- All sections as React components within the existing Vite/Tailwind project
- Custom Tailwind theme with the swab brand colors
- Mobile-first responsive design (320px+ base, scaling up)
- Smooth scroll navigation between sections
- README section explaining the GitHub repo folder structure for auto-updating projects

