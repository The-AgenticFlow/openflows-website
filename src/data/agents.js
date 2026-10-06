export const AGENT_DATA = {
  nexus: {
    name: "NEXUS",
    role: "The Controller",
    mission: "NEXUS is the Controller of the OpenFlows control plane - a long-lived process running in the openflows-nexus Coder workspace. It syncs GitHub issues into typed tickets, assigns work to FORGE workers inside isolated Coder workspaces, and drives every agent through the gated lifecycle, so every action inherits Coder's identity, audit trail, and workspace governance.",
    flow: [
      "Issue Discovery: Polls GitHub for open issues and syncs them into the SharedStore as typed tickets (T-001, T-002...) - the Redis store agents use to coordinate.",
      "Work Assignment: Matches priority tickets to idle FORGE workers inside isolated Coder workspaces, respecting CI readiness and recovery state.",
      "Pipeline Supervision: Runs a paced poll loop every ~15s across a declared flow graph, monitoring every phase across the Coder-backed agent fleet.",
      "Flow Recovery: Runs reconcile() every cycle to detect and repair unmerged PRs, orphaned tickets, stale workers, and crashed workspaces or chats - bounded to 3 attempts, then escalates to awaiting_human."
    ],
    capabilities: [
      "Autonomous GitHub Issue Discovery",
      "Multi-worker Task Assignment inside Coder workspaces",
      "Self-healing Pipeline Recovery (reconcile())",
      "CI Readiness Enforcement  -  prioritizes a CI-setup ticket first when a repo has no CI",
      "Human-in-the-loop Escalation (awaiting_human) via Slack, Discord & WhatsApp",
      "Live Control Surface  -  web control panel & CLI with a no-restart agent registry",
      "Multi-tenant Isolation  -  one Coder server, many teams via Coder RBAC + Redis keyspaces",
      "SharedStore State Supervision"
    ],
    humanIntervention: {
      intro: "NEXUS is your command center. The team is autonomous in the happy path, but it is never unsupervised - you hold final authority at every meaningful decision point, and NEXUS is the single place where the whole team surfaces what it needs from you.",
      points: [
        "Escalations surface here: NEXUS parks any ticket that reaches awaiting_human and notifies you via Slack, Discord, or WhatsApp - with the ticket ID, reason, workspace link, and GitHub link. It never lets an escalation deadlock the fleet or silently stall.",
        "Human gates: you approve or reject the testing and submit gates through the operator CLI (openflows gate decide) or the control panel. Your decision is recorded in the same versioned lifecycle record as every other transition, bound to a specific plan revision, review round, and commit head.",
        "Steer the fleet live: pause, drain, or target repos and issues, edit the live agent registry (roles, instances, model, skills, MCP) with no restart, and watch live status in one place.",
        "Full auditability: every agent action inherits a real Coder + GitHub identity, so you can audit who did what, when, and why."
      ]
    },
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
  },
  forge: {
    name: "FORGE",
    role: "The Builder",
    mission: "FORGE is the senior engineer of the team. It runs inside an isolated, ephemeral Coder workspace on its own pair branch (forge-{worker-id}/{ticket-id}), drives the gated phase machine through the openflows worker harness CLI, implements code segment by segment, runs tests, and opens pull requests - all without holding a single LLM API key or raw credential.",
    flow: [
      "Workspace Setup: NEXUS assigns a ticket and provisions an isolated Coder workspace; FORGE checks out the pair branch forge-{id}/{ticket}.",
      "Gated Planning: FORGE writes and uploads a plan to the SharedStore, sets plan_ready, and halts. SENTINEL must approve the gate before any code is written.",
      "Build & Test: FORGE implements segment by segment with conventional commits, runs the test suite, and moves through building → testing.",
      "Review & Verify: SENTINEL reviews the diff adversarially and can verify in FORGE's workspace via A2A. Rework loops back through building.",
      "Merge: FORGE opens the PR; SENTINEL approves; VESSEL watches CI, resolves conflicts, and squash-merges. Humans stay in the loop at decision points."
    ],
    capabilities: [
      "Isolated, Ephemeral Coder Workspace + Pair Branch per Ticket",
      "Gated Planning Checkpoint  -  no code until SENTINEL approves the plan",
      "Segment-by-Segment Implementation with Conventional Commits",
      "Automated Test Execution via the Harness",
      "A2A Verification Executor  -  allowlisted, audited test delegation for SENTINEL",
      "Adversarial Review + Rework Loop (/address_review, /ci_fix)",
      "Secret Scanning & Redaction Before Push",
      "Zero LLM Keys / Zero Raw Credentials in the Workspace"
    ],
    humanIntervention: {
      intro: "FORGE can't act without human-backed approval - it is gated at every step, and when it can't proceed safely it asks you an exact question instead of guessing.",
      points: [
        "Gated at both ends: FORGE writes no code until SENTINEL approves the plan gate, and it opens no PR until a human approves the testing gate.",
        "It never guesses: if FORGE hits an ambiguous spec, a missing dependency, or an unresolved conflict, it sets blocked and asks an exact, answerable question. You unblock it by answering in the Coder chat, commenting on the GitHub issue, or running openflows tenant clean.",
        "Rework is always traceable: when VESSEL routes a conflict or CI fix back, FORGE reuses its existing workspace and branch - you always know exactly which change is being reworked.",
        "Visible and audited: every plan revision, review round, and commit head is recorded, so nothing ships without a human-auditable trail."
      ]
    },
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000"
  },
  sentinel: {
    name: "SENTINEL",
    role: "The Reviewer",
    mission: "SENTINEL is the quality gatekeeper - the last line of defence between FORGE's output and the main branch. It works read-only inside an isolated ephemeral Coder workspace, approves or rejects the plan gate before any code is written, adversarially reviews the PR, and delegates verification to FORGE over the A2A bridge - rigorous, specific, and educational, and never approving when in doubt.",
    flow: [
      "Plan Gate: Reviews FORGE's plan before any code is written; approves or requests changes via a single-use gate.",
      "Verification: Reviews the diff; may delegate test commands to FORGE's workspace via the A2A bridge - a timeout or failure never counts as a pass.",
      "PR Review: Performs a holistic review of the completed work, posting inline path:line comments.",
      "Sign-off: Approves or rejects via the harness; verdicts mirror to GitHub. Rework loops FORGE back through building; VESSEL merges only after approval + green CI."
    ],
    capabilities: [
      "Adversarial Plan & PR Review (Gate-Controlled)",
      "Read-Only Workspace  -  Cannot Modify FORGE's Code",
      "Spec / Acceptance-Criteria Verification",
      "Security & Static-Analysis Review",
      "Test Coverage Enforcement  -  No Tests = Block",
      "A2A Verification Delegation (Runs Tests in FORGE's Workspace, Audited)",
      "Structured Machine-Readable Verdicts Mirrored to GitHub Inline Comments"
    ],
    humanIntervention: {
      intro: "SENTINEL is the quality gatekeeper that refuses to rubber-stamp - and its verdicts stay fully human-auditable, because a human still holds final authority over what merges.",
      points: [
        "Nothing ships on a 'looks good': SENTINEL reviews FORGE's plan and PR adversarially and posts inline path:line feedback with specific, actionable reasoning.",
        "When in doubt, it doesn't approve: if a required artifact or verification result is missing or unreadable, SENTINEL hard-fails rather than pass - it would rather block a ticket than merge unverified work.",
        "Human-readable verdicts: its final decision mirrors to GitHub as an APPROVE / REQUEST_CHANGES review with file:line fixes you can read and act on.",
        "A human still has final say: SENTINEL approves gates, but the human approves the testing and merge gates - SENTINEL's approval alone never merges anything."
      ]
    },
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000"
  },
  vessel: {
    name: "VESSEL",
    role: "The DevOps Engineer",
    mission: "VESSEL owns the terminal stage of the development lifecycle. As a controller-side monitor it observes the full GitHub-native PR lifecycle from the shared PR store, polls CI status, detects merge conflicts early, and squash-merges approved PRs. It is the only agent authorized to push directly to the main branch - with every merge action tied to Coder's identity and audit system.",
    flow: [
      "CI Polling: Monitors GitHub check runs and the shared PR store with a configurable timeout - missing or timed-out CI never counts as success.",
      "Conflict Detection: Checks the PR's mergeable field early and routes conflicts back to FORGE.",
      "Rework Dispatch: For conflicts, changes_requested, or unaddressed comments, dispatches /address_review into FORGE's existing chat session; /ci_fix for failing checks.",
      "Merge Governance: Squash-merges only ready_for_merge PRs - approved + conflict-free + green CI. Emits ticket_merged, closes the issue, and recycles the worker."
    ],
    capabilities: [
      "CI/CD Status Polling (GitHub Actions)",
      "Early Merge Conflict Detection",
      "Automated Rebase & Conflict Resolution",
      "Structured Rework Dispatch (/address_review, /ci_fix)",
      "Merge Gate  -  Only Merges ready_for_merge PRs",
      "Squash Merge with Ticket References",
      "Sole Agent Authorized for Main Branch Merges"
    ],
    humanIntervention: {
      intro: "VESSEL is the safest pair of hands on the main branch - it never force-pushes or bypasses protection, and when merging gets hard, a human steps in.",
      points: [
        "Strict merge gate: VESSEL only merges a PR that is approved, conflict-free, and CI-green - never before. Missing or timed-out CI never counts as success.",
        "Escalates instead of forcing: if VESSEL can't resolve a merge conflict automatically (max 3 attempts), it escalates to awaiting_human rather than force-pushing or bypassing branch protection.",
        "Auditable merges: every merge is tied to a real Coder + GitHub identity and recorded in the lifecycle, so you can audit exactly what merged, when, and why.",
        "You hold final authority: a human approves the merge gate before VESSEL is authorized to squash-merge."
      ]
    },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
  },
  lore: {
    name: "LORE",
    role: "The Documenter",
    mission: "LORE is the team's documenter, preserving long-term project health and institutional memory. After every successful merge it generates Architecture Decision Records, updates CHANGELOG.md, and commits documentation changes - fully auditable inside your Coder environment. LORE is optional and disabled by default; enable it in the live agent registry.",
    flow: [
      "Merge Trigger: Activates after VESSEL emits a merge event - never interrupts or blocks active development.",
      "ADR Generation: Synthesizes architectural decisions recorded in the SharedStore into a structured ADR.",
      "Changelog Update: Appends a deployment summary to CHANGELOG.md with PR references and ticket IDs.",
      "Doc Commit: Commits and pushes documentation changes to the main branch - writing only to docs/, with read-only access to application code."
    ],
    capabilities: [
      "Autonomous ADR Generation",
      "CHANGELOG.md Maintenance",
      "Post-Merge Trigger - Never Blocks Development",
      "Institutional Memory & Project History Synthesis",
      "Read-Only Access to Application Code (Writes Only to docs/)",
      "Optional & Disabled by Default - Enable in the Live Agent Registry"
    ],
    humanIntervention: {
      intro: "LORE makes the human-in-the-loop trail durable - it preserves the institutional memory, so you can always reconstruct why a change was made, not just what changed.",
      points: [
        "A record you can trust: LORE writes an ADR for every architectural decision recorded in the SharedStore and a CHANGELOG entry for every successful deployment, so the full decision history stays auditable.",
        "Reconstruct the 'why': because everything is documented after every merge, a human can trace exactly why a change was made and how it fit the architecture.",
        "Never blocks development: LORE only works after a merge event and only touches docs/ - it has read-only access to application code.",
        "Optional by design: LORE is disabled by default; enable it in the live agent registry when you want the documentation layer."
      ]
    },
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000"
  }
};
