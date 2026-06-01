export const AGENT_DATA = {
  nexus: {
    name: "NEXUS",
    role: "The Orchestrator",
    mission: "NEXUS is the brain of the OpenFlows ecosystem, responsible for programmatic issue discovery and strategic task segmentation.",
    flow: [
      "Issue Sync: Programmatically identifies actionable GitHub issues.",
      "Strategic Planning: Segments complex issues into discrete execution units.",
      "Agent Provisioning: Dynamically routes tasks to specialized FORGE instances.",
      "Progress Monitoring: Monitors the inter-agent state machine in SharedStore."
    ],
    capabilities: [
      "Autonomous Issue Discovery",
      "Task Segmentation Logic",
      "Dynamic Resource Allocation",
      "High-level Project Observability"
    ],
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000"
  },
  forge: {
    name: "FORGE",
    role: "The Developer",
    mission: "FORGE is the high-performance builder agent, operating within isolated pair-harness environments to implement reliable code changes.",
    flow: [
      "Task Reception: Decodes granular instructions from NEXUS via SharedStore.",
      "Plan Generation: Drafts a technical implementation PLAN.md.",
      "Isolated Implementation: Writes code and runs local tests in a secure worktree.",
      "Contract Fulfillment: Submits implementation for safety review by SENTINEL."
    ],
    capabilities: [
      "Rust-Engine Integration",
      "Isolated Worktree Implementation",
      "Multi-file Code Generation",
      "Local Test Orchestration"
    ],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000"
  },
  sentinel: {
    name: "SENTINEL",
    role: "The Reviewer",
    mission: "SENTINEL is the mission-critical safety and logic gatekeeper, ensuring every commit adheres to technical contracts and safety protocols.",
    flow: [
      "Contract Loading: Retrieves technical expectations from the FORGE plan.",
      "Deep Logic Review: Analyzes diffs for security vulnerabilities and logic errors.",
      "Programmatic Feedback: Provides structured, machine-readable critique to FORGE.",
      "Governance Approval: Final sign-off on the 'SENTINEL AGREED' state."
    ],
    capabilities: [
      "Automated Security Analysis",
      "Contract Enforcement",
      "Structured Multi-Agent Feedback",
      "Technical Governance Compliance"
    ],
    image: "https://images.unsplash.com/photo-1558488214-5d9c791338a0?auto=format&fit=crop&q=80&w=1000"
  },
  vessel: {
    name: "VESSEL",
    role: "The Operator",
    mission: "VESSEL manages the terminal stage of the development lifecycle, coordinating CI/CD success and secure production merges.",
    flow: [
      "PR Management: Automatically opens and updates pull requests.",
      "CI/CD Coordination: Monitors build pipelines and automated test suites.",
      "Conflict Resolution: Employs specialized rework loops to handle rebase churn.",
      "Merge Governance: Executes final merge once all gates are confirmed green."
    ],
    capabilities: [
      "Automated Rebase Loops",
      "CI/CD Awareness",
      "Final Merge Governance",
      "Workflow Telemetry Collection"
    ],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
  },
  lore: {
    name: "LORE",
    role: "The Archivist",
    mission: "LORE ensures technical clarity and long-term project health by autonomously maintaining documentation and architectural records.",
    flow: [
      "Context Extraction: Synthesizes technical decisions from agent logs.",
      "ADR Generation: Autonomously drafts Architecture Decision Records.",
      "Living Documentation: Updates READMEs and API references dynamically.",
      "Onboarding Synthesis: Prepares context packages for human contributors."
    ],
    capabilities: [
      "Autonomous ADR Generation",
      "Dynamic Doc Syncing",
      "Decision Log Analysis",
      "Technical Debt Documentation"
    ],
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1000"
  }
};
