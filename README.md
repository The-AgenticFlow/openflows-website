# OpenFlows Website

The official website for OpenFlows — Your Autonomous Engineering Team.

🌐 **Live Site**: [openflows.dev](https://openflows.dev)

## About OpenFlows

OpenFlows is an autonomous software development team that runs itself. Imagine having a complete engineering team — Scrum Master, Senior Developer, Security Auditor, DevOps Engineer, and Technical Writer — that works 24/7 to turn your GitHub issues into production-ready code and pull requests.

## Website Features

- 🎨 **Dark cyberpunk aesthetic** with animated gradients
- 📱 **Fully responsive** — works on all devices
- ⚡ **Fast loading** — pure HTML/CSS, no heavy frameworks
- 🎯 **SEO optimized** with proper meta tags
- ♿ **Accessible** — semantic HTML and ARIA labels

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
├── index.html          # Main landing page
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment
└── README.md           # This file
```

## Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JS** — Minimal interactivity
- **Google Fonts** — Inter & JetBrains Mono

## Design System

### Colors
- Primary Background: `#0a0a0f`
- Secondary Background: `#12121a`
- Card Background: `#16161f`
- Accent Primary: `#e94560` (Coral/Pink)
- Accent Secondary: `#a855f7` (Purple)
- Accent Tertiary: `#3b82f6` (Blue)
- Text Primary: `#ffffff`
- Text Secondary: `#a0a0b0`

### Typography
- **Headings**: Inter (600-800 weight)
- **Body**: Inter (400-500 weight)
- **Code**: JetBrains Mono

## Contributing

This website is part of the [OpenFlows](https://github.com/The-AgenticFlow/OpenFlows) project. Contributions are welcome!

## License

MIT License — see [LICENSE](LICENSE) for details.

---

Built with 🖤 by The AgenticFlow Team
