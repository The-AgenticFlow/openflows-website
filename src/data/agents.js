export const AGENT_DATA = {
  nexus: {
    name: "NEXUS",
    role: "The Orchestrator",
    mission: "NEXUS is the brain of the entire pipeline — not just a ticket assigner, but the supervisor that ensures every phase of the flow completes. It detects broken states, resumes stalled pipelines, and routes work to the correct agent at any point in the lifecycle.",
    flow: [
      "Issue Discovery: Polls GitHub for open issues and syncs them into the SharedStore as typed tickets (T-001, T-002...).",
      "Work Assignment: Matches priority tickets to idle FORGE workers, respecting CI readiness and flow recovery state.",
      "Pipeline Supervision: Monitors every phase — implementation, review, merge, and documentation — not just assignment.",
      "Flow Recovery: Detects orphaned tickets, unmerged PRs, and stale workers on every cycle and resumes at the correct phase."
    ],
    capabilities: [
      "Autonomous GitHub Issue Discovery",
      "Multi-worker Task Assignment",
      "Pipeline Failure Detection & Recovery",
      "CommandGate — approves dangerous bash commands",
      "Human-to-System Communication — users ask questions, send commands, and receive updates via NEXUS",
      "CI Readiness Enforcement",
      "SharedStore State Supervision"
    ],
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000"
  },
  forge: {
    name: "FORGE",
    role: "The Builder",
    mission: "FORGE is the senior engineer of the team. It operates inside an isolated Git worktree on its own branch, spawns Claude Code or Codex CLI with a battle-hardened persona, writes PLAN.md, implements code segment by segment, runs tests, and opens pull requests via GitHub MCP.",
    flow: [
      "Worktree Setup: Creates an isolated Git worktree on a dedicated branch (forge-1/T-001) for every ticket.",
      "Plan Generation: Writes PLAN.md with a segment-by-segment breakdown. SENTINEL reviews it → CONTRACT.md.",
      "Segment Implementation: Implements code one segment at a time. After each: commit + WORKLOG.md → SENTINEL eval.",
      "PR Creation: Once all segments pass SENTINEL's final review, opens a pull request via GitHub MCP."
    ],
    capabilities: [
      "Isolated Git Worktree per Ticket",
      "Claude Code & Codex CLI Integration",
      "Segment-by-Segment Implementation",
      "Automated Test Execution",
      "Secret Scanning & Redaction Before Push",
      "GitHub MCP Pull Request Creation"
    ],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
  },
  sentinel: {
    name: "SENTINEL",
    role: "The Reviewer",
    mission: "SENTINEL is the security auditor and quality gatekeeper. It is ephemeral — spawned fresh for each evaluation — which means no accumulated bias. It reviews FORGE's plan before a single line of code is written, evaluates every segment after it's committed, and signs off on the final review before any PR is opened.",
    flow: [
      "Contract Review: Reads FORGE's PLAN.md and writes CONTRACT.md — AGREED or CHANGES_REQUESTED with specific feedback.",
      "Segment Evaluation: After each FORGE commit, evaluates the diff against 5 criteria and writes segment-N-eval.md.",
      "Final Review: Performs a holistic review of all segments combined and writes final-review.md.",
      "Governance Sign-off: Only after APPROVED does FORGE proceed to open the pull request."
    ],
    capabilities: [
      "Ephemeral Process — No Accumulated Bias",
      "5-Criteria Segment Evaluation",
      "Security Vulnerability Detection",
      "Test Coverage Enforcement",
      "Structured Machine-Readable Feedback",
      "Read-Only Permissions — Cannot Modify Code"
    ],
    image: "https://images.unsplash.com/photo-1558488214-5d9c791338a0?auto=format&fit=crop&q=80&w=1000"
  },
  vessel: {
    name: "VESSEL",
    role: "The DevOps Engineer",
    mission: "VESSEL owns the terminal stage of the development lifecycle. It polls CI status, detects merge conflicts early via GitHub's mergeable field, attempts automated conflict resolution, and squash-merges approved PRs. It is the only agent authorized to push directly to the main branch.",
    flow: [
      "CI Polling: Monitors GitHub check runs at 10-second intervals with configurable timeout (default 30 min).",
      "Conflict Detection: Checks the PR's mergeable field before CI completes — routes conflicts back to FORGE early.",
      "Conflict Resolution: Attempts GitHub update-branch or local rebase. Writes CONFLICT_RESOLUTION.md for FORGE context.",
      "Merge Governance: Squash-merges green PRs with ticket references. Emits ticket_merged for LORE to pick up."
    ],
    capabilities: [
      "CI/CD Status Polling (GitHub Actions)",
      "Early Merge Conflict Detection",
      "Automated Rebase & Conflict Resolution",
      "Squash Merge with Ticket References",
      "Conflict Rework Loop — No New Branches",
      "Sole Agent Authorized for Main Branch Merges"
    ],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
  },
  lore: {
    name: "LORE",
    role: "The Documenter",
    mission: "LORE ensures long-term project health by autonomously maintaining documentation after every successful merge. It generates Architecture Decision Records, updates CHANGELOG.md, and commits documentation changes — so the project history stays alive without any human effort.",
    flow: [
      "Merge Trigger: Activates after VESSEL emits a ticket_merged event — never interrupts active development.",
      "ADR Generation: Synthesizes the technical decisions from the merged work and writes a structured ADR.",
      "Changelog Update: Appends a deployment summary to CHANGELOG.md with PR references and ticket IDs.",
      "Doc Commit: Commits and pushes documentation changes to the main branch via GitHub MCP."
    ],
    capabilities: [
      "Autonomous ADR Generation",
      "CHANGELOG.md Maintenance",
      "Post-Merge Trigger — Never Blocks Development",
      "Retrospective & Project History Synthesis",
      "GitHub MCP Documentation Commits",
      "Read-Only Access to Application Code"
    ],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000"
  }
};
