/** @type {import('./types').NewsItem[]} */
export const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Product',
    date: 'May 29, 2026',
    title: 'Introducing Openflows v1.0 — Autonomous AI Dev Team Goes Stable',
    excerpt: 'The first stable release of Openflows ships with a full FORGE-SENTINEL pair harness, Redis-backed SharedStore, and LiteLLM proxy support.',
    href: '/blog/openflows-v1',
    image: '/images/v1-stable.png',
    featured: true,
  },
  {
    id: 2,
    category: 'Research',
    date: 'May 20, 2026',
    title: 'How multi-agent code review reduces PR defect rate by 3×',
    excerpt: 'A deep dive into the SENTINEL evaluation framework and the 5 criteria it checks on every code segment before approving a merge.',
    href: '/blog/multi-agent-review',
    image: '/images/code-review.png',
    featured: false,
  },
  {
    id: 3,
    category: 'Product',
    date: 'May 15, 2026',
    title: 'Per-agent model routing: give each AI the right brain for its job',
    excerpt: 'Route FORGE to Claude Sonnet, SENTINEL to Gemini Pro, VESSEL to Groq — all from a single registry.json file.',
    href: '/blog/model-routing',
    image: '/images/model-routing.png',
    featured: false,
  },
  {
    id: 4,
    category: 'Company',
    date: 'May 10, 2026',
    title: "Openflows joins the Open Source Initiative's affiliate program",
    excerpt: "We're proud to announce our affiliation with the OSI as part of our commitment to open, collaborative AI tooling.",
    href: '/blog/osi-affiliate',
    image: '/images/osi-affiliate.png', // New unique asset (to be moved)
    featured: false,
  },
  {
    id: 5,
    category: 'Developers',
    date: 'May 5, 2026',
    title: 'New: interactive API explorer in the developer portal',
    excerpt: 'Test every Openflows REST endpoint live — authenticate, fire requests, and inspect responses without leaving the browser.',
    href: '/developers/api-explorer',
    image: '/images/api-explorer.png', // New unique asset (to be moved)
    featured: false,
  },
  {
    id: 6,
    category: 'Product',
    date: 'Apr 28, 2026',
    title: 'VESSEL conflict rework loop eliminates manual rebase churn',
    excerpt: 'VESSEL now writes CONFLICT_RESOLUTION.md and re-routes the same FORGE worker — no context loss, no new branches.',
    href: '/blog/vessel-conflict-rework',
    image: '/images/vessel-loop.png', // New unique asset (to be moved)
    featured: false,
  },
]

/** @type {import('./types').StoryItem[]} */
export const STORIES = [
  {
    id: 1,
    category: 'Startup',
    date: 'May 2026',
    title: 'How a 2-person team shipped 40 features in a month with Openflows',
    href: '/stories/startup-40-features',
    image: '/images/startup-success.png', // New unique asset (to be moved)
  },
  {
    id: 2,
    category: 'DevOps',
    date: 'May 2026',
    title: 'Using VESSEL to fully automate CI/CD pipelines on GitHub Actions',
    href: '/stories/devops-cicd',
    image: '/images/cicd-automation.png', // New unique asset (to be moved)
  },
  {
    id: 3,
    category: 'Open Source',
    date: 'Apr 2026',
    title: 'Openflows maintaining its own backlog — eating the dog food at scale',
    href: '/stories/self-maintaining',
    image: '/images/self-healing.png', // New unique asset (to be moved)
  },
]
