export const AGENT_DATA = {
  nexus: {
    name: "NEXUS",
    role: "The Orchestrator",
    mission: "NEXUS is the orchestration brain of the OpenFlows control plane. It governs how agents coordinate on top of your Coder environment  -  polling GitHub, assigning work to FORGE workers inside Coder workspaces, and routing commands through Coder's control-plane APIs so every action inherits Coder's identity, audit trail, and workspace governance.",
    flow: [
      "Issue Discovery: Polls GitHub for open issues and syncs them into the SharedStore as typed tickets (T-001, T-002...).",
      "Work Assignment: Matches priority tickets to idle FORGE workers running inside Coder workspaces, respecting CI readiness and flow recovery state.",
      "Pipeline Supervision: Monitors every phase  -  implementation, review, merge, and documentation  -  across the Coder-backed agent fleet.",
      "Flow Recovery: Detects orphaned tickets, unmerged PRs, and stale workers on every cycle and resumes each pipeline at the correct phase."
    ],
    capabilities: [
      "Autonomous GitHub Issue Discovery",
      "Multi-worker Task Assignment inside Coder workspaces",
      "Pipeline Failure Detection & Recovery",
      "CommandGate  -  approves dangerous bash commands",
      "Human-to-System Communication  -  users ask questions, send commands, and receive updates via NEXUS",
      "CI Readiness Enforcement",
      "SharedStore State Supervision"
    ],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
  },
  forge: {
    name: "FORGE",
    role: "The Builder",
    mission: "FORGE is the senior engineer of the team. It runs inside an isolated Coder workspace on its own branch, spawns a CLI code agent (Claude Code, Codex CLI, Aider, or any Coder Registry module) with a battle-hardened persona, writes PLAN.md, implements code segment by segment, runs tests, and opens pull requests via GitHub MCP  -  all within Coder's governed environment.",
    flow: [
      "Workspace Setup: Provisions an isolated Coder workspace and Git worktree on a dedicated branch (forge-1/T-001) for every ticket.",
      "Plan Generation: Writes PLAN.md with a segment-by-segment breakdown. SENTINEL reviews it → CONTRACT.md.",
      "Segment Implementation: Implements code one segment at a time. After each: commit + WORKLOG.md → SENTINEL eval.",
      "PR Creation: Once all segments pass SENTINEL's final review, opens a pull request via GitHub MCP."
    ],
    capabilities: [
      "Isolated Coder Workspace + Git Worktree per Ticket",
      "Claude Code, Codex CLI & Aider Integration via Coder Modules",
      "Segment-by-Segment Implementation",
      "Automated Test Execution",
      "Secret Scanning & Redaction Before Push",
      "GitHub MCP Pull Request Creation"
    ],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
  },
  sentinel: {
    name: "SENTINEL",
    role: "The Reviewer",
    mission: "SENTINEL is the security auditor and quality gatekeeper. It is ephemeral  -  spawned fresh for each evaluation  -  which means no accumulated bias. It reviews FORGE's plan before a single line of code is written, evaluates every segment after it's committed, and signs off on the final review before any PR is opened, keeping the agentic dev team honest and auditable.",
    flow: [
      "Contract Review: Reads FORGE's PLAN.md and writes CONTRACT.md - AGREED or CHANGES_REQUESTED with specific feedback.",
      "Segment Evaluation: After each FORGE commit, evaluates the diff against 5 criteria and writes segment-N-eval.md.",
      "Final Review: Performs a holistic review of all segments combined and writes final-review.md.",
      "Governance Sign-off: Only after APPROVED does FORGE proceed to open the pull request."
    ],
    capabilities: [
      "Ephemeral Process - No Accumulated Bias",
      "5-Criteria Segment Evaluation",
      "Security Vulnerability Detection",
      "Test Coverage Enforcement",
      "Structured Machine-Readable Feedback",
      "Read-Only Permissions - Cannot Modify Code"
    ],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
  },
  vessel: {
    name: "VESSEL",
    role: "The DevOps Engineer",
    mission: "VESSEL owns the terminal stage of the development lifecycle. It polls CI status, detects merge conflicts early via GitHub's mergeable field, attempts automated conflict resolution, and squash-merges approved PRs. It is the only agent authorized to push directly to the main branch  -  with every merge action tied to Coder's identity and audit system.",
    flow: [
      "CI Polling: Monitors GitHub check runs at 10-second intervals with configurable timeout (default 30 min).",
      "Conflict Detection: Checks the PR's mergeable field before CI completes - routes conflicts back to FORGE early.",
      "Conflict Resolution: Attempts GitHub update-branch or local rebase. Writes CONFLICT_RESOLUTION.md for FORGE context.",
      "Merge Governance: Squash-merges green PRs with ticket references. Emits ticket_merged for LORE to pick up."
    ],
    capabilities: [
      "CI/CD Status Polling (GitHub Actions)",
      "Early Merge Conflict Detection",
      "Automated Rebase & Conflict Resolution",
      "Squash Merge with Ticket References",
      "Conflict Rework Loop - No New Branches",
      "Sole Agent Authorized for Main Branch Merges"
    ],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
  },
  lore: {
    name: "LORE",
    role: "The Documenter",
    mission: "LORE ensures long-term project health by autonomously maintaining documentation after every successful merge. It generates Architecture Decision Records, updates CHANGELOG.md, and commits documentation changes  -  so the architecture history stays alive without any human effort, fully auditable inside your Coder environment.",
    flow: [
      "Merge Trigger: Activates after VESSEL emits a ticket_merged event - never interrupts active development.",
      "ADR Generation: Synthesizes the technical decisions from the merged work and writes a structured ADR.",
      "Changelog Update: Appends a deployment summary to CHANGELOG.md with PR references and ticket IDs.",
      "Doc Commit: Commits and pushes documentation changes to the main branch via GitHub MCP."
    ],
    capabilities: [
      "Autonomous ADR Generation",
      "CHANGELOG.md Maintenance",
      "Post-Merge Trigger - Never Blocks Development",
      "Retrospective & Project History Synthesis",
      "GitHub MCP Documentation Commits",
      "Read-Only Access to Application Code"
    ],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000"
  }
};
