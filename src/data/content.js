/** @type {import('./types').NewsItem[]} */
export const NEWS_ITEMS = [
  {
    id: 1,
    category: 'Release',
    date: 'May 29, 2026',
    title: 'OpenFlows v1.0 - Autonomous AI Dev Team Goes Stable',
    excerpt: 'The first stable release ships with the full FORGE-SENTINEL pair harness, Redis-backed SharedStore, LiteLLM proxy routing, and a TUI setup wizard. From issue to merged PR, fully autonomous.',
    href: '/blog/openflows-v1',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
    featured: true,
  },
  {
    id: 2,
    category: 'Research',
    date: 'May 20, 2026',
    title: 'How multi-agent code review cuts PR defect rate by 3×',
    excerpt: 'A deep dive into the SENTINEL evaluation framework - the 5 criteria it checks on every code segment before approving a merge, and why ephemeral reviewers outperform persistent ones.',
    href: '/blog/multi-agent-review',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000',
    featured: false,
  },
  {
    id: 3,
    category: 'Product',
    date: 'May 15, 2026',
    title: 'Per-agent model routing: give each AI the right brain for its job',
    excerpt: 'Route FORGE to Claude Sonnet, SENTINEL to Gemini Pro, VESSEL to Groq - all from a single registry.json. Hot-reloaded on every NEXUS poll, no restart required.',
    href: '/blog/model-routing',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000',
    featured: false,
  },
  {
    id: 4,
    category: 'Open Source',
    date: 'May 10, 2026',
    title: "OpenFlows joins the Open Source Initiative's affiliate program",
    excerpt: "We're proud to announce our affiliation with the OSI as part of our commitment to open, transparent, and collaborative AI tooling for every software team.",
    href: '/blog/osi-affiliate',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000',
    featured: false,
  },
  {
    id: 6,
    category: 'Product',
    date: 'Apr 28, 2026',
    title: 'VESSEL conflict rework loop eliminates manual rebase churn',
    excerpt: 'VESSEL now writes CONFLICT_RESOLUTION.md and re-routes the same FORGE worker - no context loss, no new branches, no human intervention needed for merge conflicts.',
    href: '/blog/vessel-conflict-rework',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000',
    featured: false,
  },
]

/** @type {import('./types').StoryItem[]} */
export const STORIES = []
