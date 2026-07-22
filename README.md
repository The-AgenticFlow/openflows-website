# Openflows Website

The official website for Openflows — An Autonomous AI Development Team.

🌐 **Live Site**: [openflows.dev](https://openflows.dev)

## About Openflows

Openflows is an autonomous software development team that runs itself. A squad of specialized AI agents written in Rust discovers GitHub issues, writes code, reviews it, opens pull requests, and merges them — all without human intervention.

## Website Features

- 🎨 **Precision Foundry Aesthetic** — warm espresso-charcoal backgrounds with copper/bronze accents, analog noise textures, and geometric grid backgrounds
- 📚 **Developer Documentation Hub** — comprehensive guides, API reference, architecture docs, and FAQs
- 💻 **Interactive Demos** — terminal simulation and step-by-step walkthroughs
- 🔗 **Use Cases** — real-world before/after comparisons for web dev and DevOps teams
- 📰 **Blog** — product updates and technical deep dives
- 🔌 **Developer Resources** — interactive API explorer and integration guides
- 📱 **Fully responsive** — works on all devices with hamburger navigation
- ⚡ **Fast loading** — pure HTML/CSS/JS, no heavy frameworks or build steps
- 🎯 **SEO optimized** with proper meta tags and OG image
- ♿ **Accessible** — semantic HTML, noscript fallbacks for animations
- ✨ **Scroll-triggered animations** — staggered reveals with scale transitions via Intersection Observer
- 🔧 **Terminal-first visuals** — code blocks, live demo logs, crate diagrams as primary content with scanline effects and copper border glows
- 🏗️ **Asymmetric spatial composition** — staggered architecture pillars, diagonal section separators, corner bracket decorations

## Local Development

The site is built with Astro. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then visit `http://localhost:4321`.

To build for production:

```bash
npm run build
npm run preview
```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

## Structure

```
.
├── astro.config.mjs          # Astro site configuration
├── src/
│   ├── layouts/              # Astro layouts (BaseLayout, DocsLayout)
│   ├── pages/                # Site routes
│   │   ├── index.astro       # Main landing page
│   │   ├── docs/             # Documentation (Astro + shared React components)
│   │   │   ├── index.astro
│   │   │   ├── getting-started/
│   │   │   │   ├── index.astro
│   │   │   │   ├── installation.astro
│   │   │   │   ├── token-guide.astro
│   │   │   │   └── first-issue.astro
│   │   │   ├── concepts/     # Core concepts
│   │   │   │   ├── index.astro
│   │   │   │   ├── architecture-first.astro
│   │   │   │   ├── agent-team.astro
│   │   │   │   ├── pocketflow-sharedstore.astro
│   │   │   │   ├── coder-integration.astro
│   │   │   │   └── security-model.astro
│   │   │   ├── architecture/ # Deep-dive architecture docs
│   │   │   │   ├── index.astro
│   │   │   │   ├── system-design.astro
│   │   │   │   ├── agent-roles.astro
│   │   │   │   ├── workspace-lifecycle.astro
│   │   │   │   ├── state-recovery.astro
│   │   │   │   └── decision-routing.astro
│   │   │   ├── guides/       # Practical guides
│   │   │   │   ├── index.astro
│   │   │   │   ├── agent-setup.astro
│   │   │   │   ├── model-routing.astro
│   │   │   │   ├── multi-tenancy.astro
│   │   │   │   ├── extending.astro
│   │   │   │   ├── operations.astro
│   │   │   │   └── troubleshooting.astro
│   │   │   ├── reference/    # Reference docs
│   │   │   │   ├── api.astro
│   │   │   │   ├── registry-schema.astro
│   │   │   │   ├── environment-variables.astro
│   │   │   │   └── cli.astro
│   │   │   ├── contributing/ # Contributor docs
│   │   │   │   ├── index.astro
│   │   │   │   ├── development-setup.astro
│   │   │   │   ├── adding-skills.astro
│   │   │   │   └── testing.astro
│   │   │   └── faq.astro
│   │   ├── demos/            # Demo pages
│   │   ├── use-cases/        # Use case pages
│   │   ├── blog/             # Blog pages
│   │   ├── developers/       # Developer resources
│   │   └── about.astro
│   ├── organisms/            # Page-level React components
│   ├── molecules/            # Shared React components (DocComponents, etc.)
│   ├── components/           # UI components
│   ├── styles/               # Global styles
│   ├── react-pages/          # Admin React pages
│   └── main.jsx              # React admin entry point
├── public/                   # Static assets
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment
├── CNAME                     # Custom domain config (openflows.dev)
└── README.md                 # This file
```

## Tech Stack

- **Astro** — Static site generation with React islands for interactive components
- **React** — Interactive components (docs components, admin UI, accordions, tab switchers, terminal simulations)
- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, clip-path, animations, Intersection Observer API
- **Vanilla JS** — Smooth scroll, scroll-triggered animations, accordion, code copy, search, terminal simulation, tab switcher, API explorer
- **Google Fonts** — Chakra Petch (display), Literata (body), IBM Plex Mono (code)

## Design System

### Aesthetic Direction
**Precision Foundry** — inspired by precision metalwork, mechanical drawings, and warm industrial control panels. The design communicates craftsmanship, engineering precision, and autonomous operation through copper accents, corner bracket decorations, analog noise textures, and warm dark tones.

### Colors
- Primary Background: `#0c0b09` (deep espresso charcoal)
- Surface: `#181512` (warm dark brown)
- Card Background: `#201c17` (warm brown)
- Code Background: `#0f0e0c` (near-black warmth)
- Accent Copper: `#c26d3d` (burnt copper — primary CTA, borders, highlights)
- Accent Copper Glow: `rgba(194, 109, 61, 0.25)`
- Accent Teal: `#4a9b8e` (muted teal for code/technical elements)
- Accent Gold: `#c4a35a` (brass/gold for gradients and highlights)
- Text Primary: `#f0ebe3` (warm cream)
- Text Secondary: `#9e9488` (warm taupe)
- Text Muted: `#5c554d` (dark warm gray)
- Border: `#2a2520` / `#1a1714`
- NEXUS Green: `#82b366`
- FORGE Gray: `#888888`
- SENTINEL Orange: `#d79b00`
- VESSEL Red: `#b85450`
- LORE Blue: `#6c8ebf`

### Typography
- **Display Headlines**: Chakra Petch (600-700 weight) — geometric, tech-forward, distinctive Thai/Latin sans-serif
- **Body Text**: Literata (400-600 weight) — beautiful serif bringing editorial warmth and unexpected elegance to a tech interface
- **Code / Terminal / Labels**: IBM Plex Mono (400-600 weight) — classic technical monospace

### Visual Language
- **Corner bracket decorations** on interactive elements (mechanical drawing aesthetic)
- **Copper gradient border glows** on terminal blocks and code panels
- **Analog noise texture overlay** at 2.5% opacity for warmth
- **Warm geometric grid background** masked to fade at edges
- **Diagonal copper/teal line separators** between sections
- **Staggered pillar offsets** in architecture section
- **Scanline effects** on terminal blocks
- **Agent cards with side-border color accents** (not top borders)

## Contributing

This website is part of the [Openflows](https://github.com/The-AgenticFlow/Openflows) project. Contributions are welcome!

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built by The AgenticFlow Team
