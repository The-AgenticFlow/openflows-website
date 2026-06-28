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

Simply open `index.html` in your browser:

```bash
# Using Python's built-in server
python -m http.server 8000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

## Structure

```
.
├── index.html                # Main landing page
├── assets/
│   ├── css/
│   │   ├── variables.css     # CSS custom properties (design tokens)
│   │   ├── base.css          # Reset, layout, components (from inline styles)
│   │   └── docs.css          # Documentation-specific styles
│   └── js/
│       ├── shared.js         # Smooth scroll, nav, reveal animations
│       └── docs.js           # Accordion, copy, search, terminal, tabs, API explorer
├── docs/
│   ├── index.html            # Documentation hub landing
│   ├── getting-started/
│   │   ├── index.html        # Quick start guide (accordion sections)
│   │   └── installation.html # Platform-specific install (tab switcher)
│   ├── guides/
│   │   ├── index.html        # Guides landing
│   │   ├── agent-setup.html  # Agent configuration guide
│   │   └── workflow-integration.html # CI/CD integration guide
│   ├── api/
│   │   ├── index.html        # API reference landing
│   │   ├── endpoints.html    # REST API endpoint table
│   │   └── authentication.html # API key management
│   ├── architecture/
│   │   ├── index.html        # Architecture landing
│   │   ├── system-design.html # System design overview
│   │   └── agent-roles.html  # NEXUS, FORGE, SENTINEL, LORE, VESSEL
│   └── faq.html              # Accordion-based FAQ
├── demos/
│   ├── index.html            # Demos landing
│   ├── terminal.html         # Terminal simulation (typewriter animation)
│   └── walkthrough.html      # Step-by-step workflow walkthrough
├── use-cases/
│   ├── index.html            # Use cases landing
│   ├── web-development.html  # Web dev before/after comparison
│   └── devops.html           # DevOps before/after comparison
├── blog/
│   ├── index.html            # Blog landing
│   └── introducing-demos.html # Launch announcement article
├── developers/
│   ├── index.html            # Developer resources landing
│   ├── api-explorer.html     # Interactive API endpoint tester
│   └── integrations.html     # Integration guides (GitHub, Slack, Docker)
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions deployment
├── CNAME                     # Custom domain config (openflows.dev)
└── README.md                 # This file
```

## Tech Stack

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
