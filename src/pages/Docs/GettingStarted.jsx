import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, TabSwitcher, StepHeading, PrereqCard, FeedbackFooter } from '@/molecules/DocComponents/DocComponents'

const ENV_TABS = [
  {
    label: 'Interactive (Recommended)',
    content: (
      <>
        <p>
          The TUI wizard talks to your Coder server, creates the admin user, pushes the
          <code>openflows-{`{role}`}</code> templates, then writes your <code>.env</code> and
          <code>registry.json</code> automatically. Run it from the project root after the stack is up.
        </p>
        <CodeBlock lang="bash">openflows-setup</CodeBlock>
        <p>It will walk you through:</p>
        <ol>
          <li>Target GitHub repository and per-agent GitHub tokens</li>
          <li>Workspace provider — choose <code>Coder</code> (default when <code>CODER_URL</code> is set)</li>
          <li>LLM routing — Coder AI Gateway as primary, LiteLLM as fallback</li>
          <li>Code agent per role and the Coder Registry module to install it (<code>claude-code</code>, <code>codex</code>, …)</li>
        </ol>
      </>
    ),
  },
  {
    label: 'Manual',
    content: (
      <>
        <p>Copy the template below into a <code>.env</code> file in the project root. Every variable is documented inline.</p>
        <CodeBlock lang="bash">{`# ── Core ────────────────────────────────────────
# The repository the team will work on
GITHUB_REPOSITORY=your-org/your-repo

# Code agent installed in each workspace: "claude" or "codex"
DEFAULT_CLI=claude

# The command OpenFlows uses to invoke the GitHub MCP server.
GITHUB_MCP_CMD=npx -y @modelcontextprotocol/server-github

# ── Coder (governed execution) ───────────────────
# Setting CODER_URL switches OpenFlows from local worktrees to Coder workspaces.
CODER_URL=http://localhost:7080
CODER_ADMIN_PASSWORD=Op3nFl0ws!

# Route LLM through Coder AI Gateway. When true, no LLM API keys are
# injected into workspaces — agents authenticate with the Coder session token.
USE_AI_GATEWAY=true

# Fallback proxy for providers the AI Gateway doesn't yet proxy (Local mode, non-Anthropic)
LITELLM_PROXY_URL=http://proxy:4000

# ── Per-Agent GitHub Tokens ─────────────────────
# Each agent gets its own PAT so actions are auditable per identity.
# Create tokens at https://github.com/settings/tokens with scopes:
#   repo, workflow, read:org (for NEXUS), delete_repo (for VESSEL cleanup)
AGENT_NEXUS_GITHUB_TOKEN=ghp_nexus_token_here
AGENT_FORGE_GITHUB_TOKEN=ghp_forge_token_here
AGENT_SENTINEL_GITHUB_TOKEN=ghp_sentinel_token_here
AGENT_VESSEL_GITHUB_TOKEN=ghp_vessel_token_here

# ── LLM API Keys (LiteLLM fallback only) ─────────
# Not needed when USE_AI_GATEWAY=true and your providers are proxied by the AI Gateway.
# ANTHROPIC_API_KEY=sk-ant-api-key-here
# OPENAI_API_KEY=sk-openai-api-key-here
# FIREWORKS_API_KEY=your_fireworks_key_here

# ── Debug / Logging ─────────────────────────────
RUST_LOG=info,agent_team=debug,pocketflow_core=debug`}</CodeBlock>
      </>
    ),
  },
]

const PREREQS = [
  {
    name: 'Docker + Docker Compose',
    detail: 'Runs the stack: Coder server, Redis, LiteLLM, and the OpenFlows engine. Coder provisions agent workspaces via the Docker socket.',
    install: 'https://docs.docker.com/get-docker/',
  },
  {
    name: 'Git 2.x+',
    detail: 'For repo cloning and per-agent worktree/branch management',
    install: 'https://git-scm.com/book/en/v2/Getting-Started-Installing-Git',
  },
  {
    name: 'GitHub PATs',
    detail: 'One per agent with repo + workflow scopes (read:org for NEXUS, delete_repo for VESSEL)',
    install: 'https://github.com/settings/tokens',
  },
  {
    name: 'Node.js 18+',
    detail: 'Drives the GitHub MCP server via npx',
    install: 'https://nodejs.org',
  },
  {
    name: 'Coder Premium (optional)',
    detail: 'Unlocks the AI Gateway so LLM credentials stay in the control plane and never reach the workspaces. Without it, keys route through the LiteLLM fallback.',
    install: 'https://coder.com',
  },
  {
    name: 'Rust 1.70+',
    detail: 'Only needed if you build from source instead of the Docker image',
    install: 'https://rustup.rs',
  },
]

const NEXT_STEPS = [
  {
    icon: '⚙️',
    title: 'Installation Guide',
    desc: 'Source builds, Homebrew, npm, and Compose options including LiteLLM and Redis tuning.',
    href: '/docs/getting-started/installation',
  },
  {
    icon: '🧭',
    title: 'Architecture',
    desc: 'How Coder governs where agents run and OpenFlows governs how they coordinate.',
    href: '/docs/architecture',
  },
  {
    icon: '❓',
    title: 'FAQ & Troubleshooting',
    desc: 'Coder bootstrap failures, rate limits, token scopes, CI timeouts, and common fixes.',
    href: '/docs/faq',
  },
]

export default function GettingStarted() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Getting Started' }]}>
      {/* ── Hero header ── */}
      <header className="docHero">
        <p className="docEyebrow">Quick Start</p>
        <h1>Getting Started</h1>
        <p className="docLead">
          OpenFlows orchestrates five AI agents — NEXUS, FORGE, SENTINEL, VESSEL, and LORE — on top
          of your Coder environment to take GitHub issues all the way to merged, documented pull
          requests. Coder governs where each agent runs; OpenFlows governs how they coordinate.
          This guide brings up the full stack and points the team at a real repo in about 10 minutes.
        </p>
        <div className="docMeta">
          <span className="docMetaItem">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ~10 min read
          </span>
          <span className="docMetaSep" />
          <span className="docMetaItem">6 steps</span>
          <span className="docMetaSep" />
          <span className="docMetaItem">Beginner</span>
        </div>
      </header>

      <Callout type="tip" title="What you will accomplish">
        By the end of this guide you will have Coder and OpenFlows running together, configured
        against a real GitHub repository, turning open issues into reviewed, merged PRs inside
        governed, ephemeral Coder workspaces.
      </Callout>

      {/* ── Step 1: Prerequisites ── */}
      <StepHeading step="1" id="prerequisites">Prerequisites</StepHeading>
      <div className="prereqGrid">
        {PREREQS.map((p) => (
          <PrereqCard key={p.name} name={p.name} detail={p.detail} install={p.install} />
        ))}
      </div>

      <Callout type="info" title="Claude Code vs Codex CLI">
        FORGE edits code through a CLI installed into each workspace by a Coder Registry module.
        <code>claude</code> (Claude Code) speaks the Anthropic Messages API natively; <code>codex</code>
        (OpenAI Codex CLI) speaks OpenAI Chat Completions and works with OpenAI or Fireworks. Set
        <code>DEFAULT_CLI=claude</code> or <code>DEFAULT_CLI=codex</code> to choose, and assign a
        module per agent in <code>registry.json</code> (step 3). Mixing models across roles is what
        produces natural adversarial review.
      </Callout>

      {/* ── Step 2: Bring up the stack ── */}
      <StepHeading step="2" id="stack">Bring up the stack</StepHeading>
      <p>
        The fastest path is the bundled Compose stack. It starts a Coder server (governed execution),
        Redis (the SharedStore the agents coordinate through), a LiteLLM proxy (LLM fallback), and the
        OpenFlows engine.
      </p>
      <CodeBlock lang="bash">{`git clone https://github.com/The-AgenticFlow/OpenFlows.git
cd OpenFlows

cp .env.example .env        # fill in your repository + tokens (step 3 has the details)

# The 'coder' profile brings up the Coder server + Postgres alongside OpenFlows
docker compose --profile coder up -d`}</CodeBlock>
      <p>What just started:</p>
      <ul>
        <li><strong>Coder</strong> — <code>http://localhost:7080</code>, the governed runtime for every agent workspace</li>
        <li><strong>OpenFlows</strong> — <code>http://localhost:3000</code>, the orchestration engine</li>
        <li><strong>Redis</strong> — <code>:6379</code>, the SharedStore backing cross-agent state</li>
        <li><strong>LiteLLM</strong> — <code>http://localhost:4000</code>, LLM fallback proxy</li>
      </ul>
      <Callout type="warning" title="Docker socket">
        Coder provisions workspaces as Docker containers, so the Compose stack mounts the host Docker
        socket. Run this on a host where that is acceptable, or point OpenFlows at an external Coder
        server by setting <code>CODER_URL</code> and skipping the <code>--profile coder</code> flag.
      </Callout>

      {/* ── Step 3: Configure ── */}
      <StepHeading step="3" id="configure">Configure your environment</StepHeading>
      <p>
        OpenFlows needs two files: a <code>.env</code> with tokens, keys, and Coder connection
        details, and a <code>registry.json</code> that maps each agent to its model, code agent CLI,
        and Coder module. Setting <code>CODER_URL</code> is what switches the team from local
        worktrees to governed Coder workspaces.
      </p>

      <TabSwitcher tabs={ENV_TABS} />

      <Callout type="warning" title="Token scopes">
        Each agent token needs <code>repo</code> and <code>workflow</code> scopes. NEXUS benefits from
        <code>read:org</code> for team assignment, and VESSEL may need <code>delete_repo</code> if you
        enable branch cleanup. Never reuse one token across agents — per-agent tokens are what make
        every action auditable to a specific identity.
      </Callout>

      {/* ── Step 3.1: Model Registry ── */}
      <h3 id="model-registry">3.1 Model Registry (registry.json)</h3>
      <p>
        The registry tells each agent which LLM to use, which CLI to install, and how to run inside
        Coder. With <code>workspace_provider: "coder"</code> and AI Gateway enabled, model calls route
        through the Coder AI Gateway using the workspace session token — no LLM keys leak into the
        workspace environment. The <code>coder_module</code> field picks the Coder Registry module
        that installs the agent CLI into each workspace.
      </p>
      <CodeBlock lang="json">{`{
  "agents": {
    "nexus":    { "cli": "claude", "model_backend": "anthropic:claude-sonnet-4-5", "workspace_provider": "coder", "coder_module": { "source": "registry.coder.com/coder/claude-code/coder", "version": "5.2.0", "permission_mode": "plan" } },
    "forge":    { "cli": "claude", "model_backend": "anthropic:claude-sonnet-4-5", "workspace_provider": "coder", "coder_module": { "source": "registry.coder.com/coder/claude-code/coder", "version": "5.2.0", "permission_mode": "acceptEdits" } },
    "sentinel": { "cli": "codex",  "model_backend": "openai:gpt-4.1",             "workspace_provider": "coder", "coder_module": { "source": "registry.coder.com/coder-labs/codex/coder", "permission_mode": "plan" } },
    "vessel":   { "cli": "codex",  "model_backend": "openai:gpt-4o",              "workspace_provider": "coder", "coder_module": { "source": "registry.coder.com/coder-labs/codex/coder", "permission_mode": "acceptEdits" } },
    "lore":     { "cli": "claude", "model_backend": "anthropic:claude-haiku-4-5", "workspace_provider": "coder", "coder_module": { "source": "registry.coder.com/coder/claude-code/coder", "version": "5.2.0", "permission_mode": "acceptEdits" } }
  }
}`}</CodeBlock>
      <p>
        Mixing providers — FORGE on Claude, SENTINEL on GPT‑4.1, LORE on Haiku — creates natural
        adversarial behavior: the reviewer catches what the builder misses. The TUI wizard generates
        this file for you. For non-Anthropic providers the AI Gateway doesn't yet proxy, the
        LiteLLM fallback (<code>LITELLM_PROXY_URL</code>) takes over using the keys in <code>.env</code>.
      </p>

      {/* ── Step 4: Verify ── */}
      <StepHeading step="4" id="verify">Verify Installation</StepHeading>
      <p>Run the built-in doctor to check every dependency — and the Coder server — before starting the team.</p>
      <CodeBlock lang="bash">openflows-doctor</CodeBlock>
      <p>Expected output:</p>
      <CodeBlock lang="bash">{`$ openflows-doctor
  Docker:              27.2.0
  Node.js:             v20.11.0
  Git:                 2.44.0
  GitHub tokens:       4/4 present
  GITHUB_REPOSITORY:   owner/repo
  Coder server:        reachable at http://localhost:7080
  Workspace provider:  coder
  AI Gateway:          enabled
  LiteLLM proxy:       reachable at http://proxy:4000
  registry.json:       valid`}</CodeBlock>

      <Callout type="tip" title="Missing something?">
        The doctor prints exactly which token, binary, or service is missing and a link to where to
        get it. If the Coder server isn't reachable, confirm the container is healthy
        (<code>docker compose ps coder</code>) and that <code>CODER_URL</code> matches
        <code>CODER_ACCESS_URL</code>. Fix it, re-run, and proceed.
      </Callout>

      {/* ── Step 5: Run ── */}
      <StepHeading step="5" id="run">Run the autonomous team</StepHeading>
      <p>
        Two commands: one starts the orchestration engine, the other shows real-time worker status.
        In Coder mode, NEXUS provisions an ephemeral workspace per ticket instead of a local worktree.
      </p>

      <CodeBlock lang="bash">{`# Start the engine — it boots, then connects to your Coder server
openflows

# In a second terminal — real-time dashboard
openflows-dashboard`}</CodeBlock>

      <p>What happens when <code>openflows</code> starts in Coder mode:</p>
      <ol>
        <li><strong>NEXUS</strong> polls GitHub for open issues and worker state</li>
        <li>Idle issues are assigned to a <strong>FORGE</strong> worker bound to a unique <code>openflows-forge</code> Coder template</li>
        <li>That template builds an ephemeral Coder workspace: clones the repo, installs the code agent CLI via its Registry module, and starts the harness</li>
        <li><strong>FORGE</strong> writes <code>PLAN.md</code> and implements segment by segment inside the workspace</li>
        <li><strong>SENTINEL</strong> reviews every segment against 5 criteria before approving (plan-only, can't auto-edit)</li>
        <li><strong>VESSEL</strong> handles CI status, conflicts, and squash-merges approved PRs</li>
        <li><strong>LORE</strong> writes ADRs and updates <code>CHANGELOG.md</code> after each merge</li>
        <li>When the PR merges, NEXUS archives the chat and tears the workspace down</li>
      </ol>

      <Callout type="info" title="Local fallback">
        Prefer to run agents as local processes for a quick test? Leave <code>CODER_URL</code> unset
        and OpenFlows falls back to local worktrees under <code>~/.agentflow/workspaces/</code>. LLM
        calls then route through LiteLLM (or direct provider keys) since there is no Coder AI Gateway.
        This is great for a smoke test, but you lose the governed, ephemeral execution that Coder
        provides.
      </Callout>

      {/* ── Step 6: Logs ── */}
      <StepHeading step="6" id="logs">What the logs look like</StepHeading>
      <p>From open issue to merged PR, fully governed in Coder workspaces, with no human intervention.</p>
      <Callout type="info" title="Illustrative">
        The log lines below represent the lifecycle and are paraphrased for clarity. Your exact output
        will vary with your repo and models.
      </Callout>
      <CodeBlock lang="bash">{`INFO  Starting orchestration (workspace_provider = Coder)
INFO  Coder server reachable at http://localhost:7080
INFO  Templates up to date: openflows-{nexus,on forge,sentinel,vessel,lore}
INFO  Found 3 open issues
INFO  Assigning issue #1 to forge-1  ->  T-001
INFO  Provisioning Coder workspace: forge-T-001
INFO  Workspace running — code agent installed via claude-code module
INFO  Repo cloned into /home/coder/workspace
INFO  PLAN.md written — spawning SENTINEL review
INFO  Contract AGREED — implementation starting
INFO  forge-T-001 completed — PR opened: #1
INFO  CI status: success for PR #1
INFO  PR #1 merged successfully
INFO  LORE: ADR-001 written and committed
INFO  Chat archived + workspace destroyed for T-001`}</CodeBlock>

      {/* ── Next Steps ── */}
      <h2 id="next-steps">Next Steps</h2>
      <p>Now that the team is running inside your governed Coder environment, keep going:</p>
      <div className="docCards">
        {NEXT_STEPS.map(({ icon, title, desc, href }) => (
          <a key={href} href={href} className="docCard">
            <div className="docCardIcon">{icon}</div>
            <div className="docCardTitle">{title}</div>
            <div className="docCardDesc">{desc}</div>
          </a>
        ))}
      </div>

      <Callout type="info" title="Need help?">
        If the doctor reports a missing dependency, Coder bootstrap fails, or NEXUS can't assign
        tickets, start with the <a href="/docs/faq">FAQ</a> or open a discussion on
        <a href="https://github.com/The-AgenticFlow/OpenFlows/discussions" target="_blank" rel="noopener noreferrer">GitHub Discussions</a>.
      </Callout>

      <FeedbackFooter />
    </DocsLayout>
  )
}