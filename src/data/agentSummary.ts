// Short, card-sized descriptions of each agent. Full detail lives in agents.js.
export interface AgentSummary {
  id: 'nexus' | 'forge' | 'sentinel' | 'vessel' | 'lore';
  name: string;
  role: string;
  color: string;
  tagline: string;
  tags: string[];
  icon: string;
  spec: { runs: string; writes: string; never: string };
}

export const AGENT_SUMMARY: AgentSummary[] = [
  {
    id: 'nexus',
    name: 'NEXUS',
    role: 'Orchestrator',
    color: 'var(--color-agent-nexus)',
    tagline: 'Turns GitHub issues into typed tickets, assigns workers, and runs reconcile() every cycle so nothing stalls silently.',
    tags: ['Issue sync', 'Assignment', 'Recovery'],
    spec: { runs: 'openflows-nexus workspace', writes: 'Tickets, assignments, escalations', never: 'Lets an escalation stall silently' },
    icon: '<circle cx="12" cy="12" r="3"/><circle cx="4.5" cy="6" r="1.8"/><circle cx="19.5" cy="6" r="1.8"/><circle cx="4.5" cy="18" r="1.8"/><circle cx="19.5" cy="18" r="1.8"/><path d="M6 7l3.6 3M18 7l-3.6 3M6 17l3.6-3M18 17l-3.6-3"/>',
  },
  {
    id: 'forge',
    name: 'FORGE',
    role: 'Builder',
    color: 'var(--color-agent-forge)',
    tagline: 'Plans first, then implements segment by segment in an isolated workspace that holds no LLM keys or raw credentials.',
    tags: ['PLAN.md', 'Commits', 'Tests'],
    spec: { runs: 'Ephemeral workspace per ticket', writes: 'Its own pair branch and PR', never: 'Holds LLM keys or raw credentials' },
    icon: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/><path d="M13.5 4l-3 16"/>',
  },
  {
    id: 'sentinel',
    name: 'SENTINEL',
    role: 'Reviewer',
    color: 'var(--color-agent-sentinel)',
    tagline: 'Approves the plan gate, reviews every PR adversarially, and verifies by running tests through the A2A relay.',
    tags: ['Plan gate', 'Review', 'A2A verify'],
    spec: { runs: 'Fresh, read-only workspace', writes: 'Gate approvals and verdicts', never: 'Approves when in doubt' },
    icon: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><circle cx="12" cy="11.5" r="2.5"/>',
  },
  {
    id: 'vessel',
    name: 'VESSEL',
    role: 'DevOps',
    color: 'var(--color-agent-vessel)',
    tagline: 'Watches CI, catches conflicts early, and squash-merges only PRs that are approved, conflict-free, and green.',
    tags: ['CI', 'Conflicts', 'Merge'],
    spec: { runs: 'Controller-side monitor', writes: 'Squash merges into main', never: 'Force-pushes or bypasses protection' },
    icon: '<path d="M12 3c3 2 5 5.5 5 9.5L15 17H9l-2-4.5C7 8.5 9 5 12 3z"/><circle cx="12" cy="10" r="1.6"/><path d="M9 17l-1.5 3.5M15 17l1.5 3.5M12 17v4"/>',
  },
  {
    id: 'lore',
    name: 'LORE',
    role: 'Documenter',
    color: 'var(--color-agent-lore)',
    tagline: 'Writes Architecture Decision Records and changelog entries after every merge, so the "why" is never lost.',
    tags: ['ADRs', 'Changelog', 'Optional'],
    spec: { runs: 'After every merge event', writes: 'docs/ only: ADRs, changelog', never: 'Blocks active development' },
    icon: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6M9 11h4"/>',
  },
];
