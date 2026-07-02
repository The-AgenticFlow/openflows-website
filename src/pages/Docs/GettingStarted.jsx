import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, TabSwitcher, StepHeading, PrereqCard, FeedbackFooter } from '@/molecules/DocComponents/DocComponents'

const PREREQS = [
  {
    name: 'Coder deployment',
    detail: 'A running Coder instance (self-hosted, VPC, or air-gapped). OpenFlows agents execute inside Coder workspaces.',
    install: 'https://coder.com/docs/install',
  },
  {
    name: 'Node.js 18+',
    detail: 'Required for the GitHub MCP server and npm install',
    install: 'https://nodejs.org',
  },
  {
    name: 'GitHub PATs (two-tier)',
    detail: 'One NEXUS token (repo scope) for issue assignment + one per worker for username lookup via IdentityManager. Per-agent tokens make every action auditable.',
    install: 'https://github.com/settings/tokens',
  },
  {
    name: 'LLM access',
    detail: 'Coder AI Gateway (primary) or LiteLLM proxy (fallback) for self-hosted providers',
    install: 'Configure in Coder dashboard',
  },
  {
    name: 'Coder CLI module',
    detail: 'A Coder Registry module that installs your preferred code agent CLI into each workspace — Claude Code, Codex CLI, Aider, and more.',
    install: 'https://registry.coder.com',
  },
]

const NEXT_STEPS = [
  {
    icon: '⚙️',
    title: 'Agent Setup',
    desc: 'Tune model routing, worker slots, and per-agent prompts for Coder workspaces.',
    href: '/docs/guides/agent-setup',
  },
  {
    icon: '🧭',
    title: 'Agent Roles',
    desc: "Understand each agent's contract, recovery behavior, and workspace lifecycle.",
    href: '/docs/architecture/agent-roles',
  },
  {
    icon: '❓',
    title: 'FAQ & Troubleshooting',
    desc: 'Coder connectivity, AI Gateway routing, token scopes, and common fixes.',
    href: '/docs/faq',
  },
]

export default function GettingStarted() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Getting Started' }]}>
      {/* ── Hero header ── */}
      <header className="docHero">
        <p className="docEyebrow">Quick Start Guide</p>
        <h1>Getting Started</h1>
        <p className="docLead">
          OpenFlows is the orchestration layer that runs on top of your Coder environment.
          Five agents — NEXUS, FORGE, SENTINEL, VESSEL, and LORE — collaborate to take issues
          all the way to merged, documented pull requests without human intervention. Coder
          governs <em>where</em> agents run; OpenFlows governs <em>how</em> they coordinate.
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
        By the end of this guide you will have OpenFlows installed, configured against your Coder
        deployment, and running with ephemeral workspaces that turn open issues into reviewed,
        merged PRs.
      </Callout>

      {/* ── Step 1: Prerequisites ── */}
      <StepHeading step="1" id="prerequisites">Prerequisites</StepHeading>
      <div className="prereqGrid">
        {PREREQS.map((p) => (
          <PrereqCard key={p.name} name={p.name} detail={p.detail} install={p.install} />
        ))}
      </div>

      <Callout type="info" title="Coder CLI modules — the muscle layer">
        FORGE edits code through a CLI code agent installed into each workspace by a
        <strong>Coder Registry module</strong>. The module you choose determines which CLI is
        available:
        <ul>
          <li><strong>claude-code</strong> — Anthropic's Claude Code CLI (speaks Messages API natively)</li>
          <li><strong>codex</strong> — OpenAI's Codex CLI (speaks Chat Completions, works with OpenAI or Fireworks)</li>
          <li><strong>aider</strong> — open-source AI pair programming in the terminal</li>
        </ul>
        Set <code>DEFAULT_CLI=claude</code>, <code>DEFAULT_CLI=codex</code>, or
        <code>DEFAULT_CLI=aider</code> in your environment to choose. You can also assign a
        different module per agent in <code>registry.json</code> (step 3) — mixing CLIs across
        roles is fully supported. The selected module must be published in your Coder deployment.
      </Callout>

      {/* ── Step 2: Install ── */}
      <StepHeading step="2" id="install">Install OpenFlows</StepHeading>
      <p>Choose the method that fits your setup. All methods install the same binaries: <code>openflows</code>, <code>openflows-setup</code>, <code>openflows-dashboard</code>, and <code>openflows-doctor</code>.</p>

      <TabSwitcher tabs={[
        {
          label: 'npm (Recommended)',
          content: (
            <>
              <p>Fastest on any platform with Node.js already installed.</p>
              <CodeBlock lang="bash">{`npm install -g @the-agenticflow/openflows
openflows --version`}</CodeBlock>
            </>
          ),
        },
        {
          label: 'One-liner',
          content: (
            <>
              <p>Downloads the correct pre-built binary for your OS and architecture, installs to <code>~/.local/bin</code>.</p>
              <CodeBlock lang="bash">{`curl -fsSL https://raw.githubusercontent.com/The-AgenticFlow/OpenFlows/main/scripts/install.sh | bash`}</CodeBlock>
            </>
          ),
        },
        {
          label: 'Cargo',
          content: (
            <>
              <p>For Rust developers who prefer cargo.</p>
              <CodeBlock lang="bash">{`cargo install openflows
openflows --version`}</CodeBlock>
            </>
          ),
        },
        {
          label: 'Docker',
          content: (
            <>
              <p>Run in a container. Mounts your config directory for persistence.</p>
              <CodeBlock lang="bash">{`docker run -it --rm \\
  -v "$HOME/.openflows:/home/openflows/.openflows" \\
  -e CODER_ACCESS_URL=https://coder.your-org.com \\
  -e CODER_TOKEN=your-coder-token \\
  ghcr.io/the-agenticflow/openflows:latest`}</CodeBlock>
            </>
          ),
        },
      ]} />

      <p>See the <a href="/docs/getting-started/installation">Installation Guide</a> for Homebrew, source builds, and Compose setups.</p>

      {/* ── Step 3: Configure ── */}
      <StepHeading step="3" id="configure">Configure Your Environment</StepHeading>
      <p>
        OpenFlows needs a <code>.env</code> file with Coder credentials and GitHub identity handled by
        Coder external auth, and a <code>registry.json</code> that maps each agent to its LLM model
        through the Coder AI Gateway. You can generate both with the interactive wizard, or write
        them manually.
      </p>

      <TabSwitcher tabs={[
        {
          label: 'Interactive (Recommended)',
          content: (
            <>
              <p>The TUI wizard asks for your Coder URL, tokens, and preferred CLI, then writes <code>.env</code> and <code>registry.json</code> automatically.</p>
              <CodeBlock lang="bash">openflows-setup</CodeBlock>
              <p>It will walk you through:</p>
              <ol>
                <li>Coder deployment URL and admin token</li>
                <li>Target GitHub repository</li>
                <li>GitHub identity — two-tier token model: NEXUS token for assign/comment, per-worker tokens for username lookup</li>
                <li>AI Gateway endpoint (or LiteLLM fallback URL)</li>
                <li>Preferred code agent CLI (Claude Code, Codex CLI, Aider, or other Coder Registry module)</li>
                <li>Model registry for each agent</li>
              </ol>
            </>
          ),
        },
        {
          label: 'Manual',
          content: (
            <>
              <p>Copy the template below into a <code>.env</code> file in your working directory. Every variable is documented inline.</p>
              <CodeBlock lang="bash">{`# ── Coder Platform ──────────────────────────────
# Your Coder deployment URL
CODER_ACCESS_URL=https://coder.your-org.com
# Coder API token (admin or workspaces:create scope)
CODER_TOKEN=your-coder-token

# ── Core ────────────────────────────────────────
# The repository the team will work on
GITHUB_REPOSITORY=your-org/your-repo

# Code agent CLI: "claude" for Claude Code, "codex" for Codex CLI, "aider" for Aider
# The corresponding Coder Registry module must be published in your deployment.
DEFAULT_CLI=claude

# The official GitHub MCP server. In Coder mode the token this server uses is
# injected by Coder external auth (see below) — nothing to paste here.
GITHUB_MCP_CMD=npx -y @modelcontextprotocol/server-github

# ── LLM Routing ─────────────────────────────────
# Primary: Coder AI Gateway (centrally managed, no keys in workspaces)
AI_GATEWAY_URL=https://coder.your-org.com/ai-gateway
# Fallback: LiteLLM proxy (for self-hosted or air-gapped providers)
# LITELLM_PROXY_URL=http://litellm:4000
# LITELLM_API_KEY=sk-litellm-key

# ── GitHub identity (two-tier token model) ──────
# NEXUS token: used for assign_issue and comment_on_issue calls.
# Requires repo scope (and workflow scope if CI status checks are needed).
GITHUB_NEXUS_TOKEN=ghp_nexus_token_with_repo_scope

# Worker tokens: each used only for get_authenticated_user_login()
# (GET /user) to resolve the GitHub username for issue assignment.
# One per agent — referenced by github_token_env in registry.json.
# If a worker token is missing, NEXUS posts a helpful comment on the
# issue instead of silently skipping assignment.
GITHUB_FORGE_TOKEN=ghp_forge_token
GITHUB_SENTINEL_TOKEN=ghp_sentinel_token
GITHUB_VESSEL_TOKEN=ghp_vessel_token
GITHUB_LORE_TOKEN=ghp_lore_token

# ── Debug / Logging ─────────────────────────────
RUST_LOG=info,agent_team=debug,pocketflow_core=debug`}</CodeBlock>
            </>
          ),
        },
      ]} />

      <Callout type="info" title="Two-tier GitHub token model">
        OpenFlows uses a <strong>two-tier</strong> token model for GitHub issue assignment:
        <ul>
          <li><strong>NEXUS token</strong> (<code>GITHUB_NEXUS_TOKEN</code>) — used for
          <code>assign_issue</code> and <code>comment_on_issue</code> calls. This is the only
          token that writes to issues.</li>
          <li><strong>Worker tokens</strong> (one per agent) — used <em>only</em> for
          <code>get_authenticated_user_login()</code> (GET /user) to dynamically resolve the
          GitHub username. The <code>IdentityManager</code> reads each worker's token from the
          env var named in <code>registry.json</code> via <code>github_token_env</code>.</li>
        </ul>
        There is <strong>no token fallback</strong>. If a worker token is missing or invalid,
        NEXUS posts a graceful failure comment on the issue explaining the problem — it never
        silently skips assignment. Three failure scenarios are handled:
        token not configured, username lookup fails (expired/invalid token), and 422 invalid
        assignee (user is not a collaborator).
      </Callout>

      {/* ── Step 3.1: Model Registry ── */}
      <h3 id="model-registry">3.1 Model Registry (registry.json)</h3>
      <p>
        The registry tells each agent which LLM to use via the Coder AI Gateway. The
        <code>workspace_provider</code> field tells OpenFlows to provision ephemeral Coder
        workspaces instead of local worktrees. You can mix providers — FORGE on Claude Sonnet,
        SENTINEL on GPT-4o, NEXUS on Gemini — creating natural adversarial review.
      </p>
      <CodeBlock lang="json">{`{
  "workspace_provider": "coder",
  "coder_module": "openflows-agent",
  "ai_gateway": {
    "primary": "coder",
    "fallback": "litellm"
  },
  "agents": {
    "nexus":    { "provider": "anthropic", "model": "claude-sonnet-4-20250514", "github_token_env": "GITHUB_NEXUS_TOKEN",    "coder_module": "claude-code" },
    "forge":    { "provider": "anthropic", "model": "claude-sonnet-4-20250514", "github_token_env": "GITHUB_FORGE_TOKEN",    "coder_module": "claude-code" },
    "sentinel": { "provider": "openai",    "model": "gpt-4.1",                  "github_token_env": "GITHUB_SENTINEL_TOKEN", "coder_module": "codex" },
    "vessel":   { "provider": "openai",    "model": "gpt-4o",                  "github_token_env": "GITHUB_VESSEL_TOKEN",   "coder_module": "codex" },
    "lore":     { "provider": "anthropic", "model": "claude-haiku-4-20250514", "github_token_env": "GITHUB_LORE_TOKEN",    "coder_module": "aider" }
  }
}`}</CodeBlock>

      <p>
        The TUI wizard generates this for you. For manual setup, place <code>registry.json</code>
        next to your <code>.env</code> file. Hot-reloaded on every NEXUS poll — no restart required.
        The <code>coder_module</code> field names the Coder Registry module that installs the CLI
        code agent into each workspace. It must be published in your Coder deployment. Different
        agents can use different modules — for example, FORGE on <code>claude-code</code> while
        LORE uses <code>aider</code> — so you can match each agent's role to the best CLI for the job.
      </p>

      <Callout type="info" title="AI Gateway vs LiteLLM">
        The Coder AI Gateway is the primary LLM route: API keys are managed centrally and never
        exposed inside workspaces. If you run air-gapped or need a self-hosted provider, configure
        LiteLLM as the fallback proxy. OpenFlows automatically falls back when the Gateway is
        unavailable.
      </Callout>

      {/* ── Step 4: Verify ── */}
      <StepHeading step="4" id="verify">Verify Installation</StepHeading>
      <p>Run the built-in doctor to check every dependency — including Coder connectivity — before starting the team.</p>
      <CodeBlock lang="bash">openflows-doctor</CodeBlock>
      <p>Expected output:</p>
      <CodeBlock lang="bash">{`$ openflows-doctor
  Coder deployment:  reachable (https://coder.your-org.com)
  Coder token:        valid (workspaces:create)
  Rust toolchain:     1.88.0
  Node.js:            v20.11.0
  Code agent CLI:     claude-code (Coder Registry module)
  Git:                2.44.0
  GitHub identity:     two-tier (NEXUS + per-worker via IdentityManager)
  AI Gateway:         reachable
  GITHUB_REPOSITORY:  owner/repo
  registry.json:      valid (workspace_provider: coder)`}</CodeBlock>

      <Callout type="tip" title="Missing something?">
        The doctor prints exactly which Coder endpoint, token, or binary is missing and a link to
        where to get it. If it reports GitHub identity unresolved, confirm that each agent's
        <code>github_token_env</code> in <code>registry.json</code> points to a valid environment
        variable, and that the corresponding token has <code>repo</code> scope. Fix it, re-run,
        and proceed.
      </Callout>

      {/* ── Step 5: Run ── */}
      <StepHeading step="5" id="run">Run the Autonomous Team</StepHeading>
      <p>Two terminals: one runs the orchestration engine, the other shows real-time worker status.</p>

      <CodeBlock lang="bash">{`# Terminal 1 - start the engine
openflows

# Terminal 2 - real-time dashboard
openflows-dashboard`}</CodeBlock>

      <p>What happens when you start <code>openflows</code> — the ephemeral workspace lifecycle:</p>
      <ol>
        <li><strong>NEXUS</strong> polls GitHub for open issues and worker state</li>
        <li>Idle issues are assigned to <strong>FORGE</strong> workers with unique ticket IDs</li>
        <li>NEXUS provisions an <strong>ephemeral Coder workspace</strong> for each FORGE worker</li>
        <li>FORGE runs inside the workspace, writes PLAN.md, and implements segment by segment</li>
        <li><strong>SENTINEL</strong> reviews every segment against 5 criteria before approving</li>
        <li><strong>VESSEL</strong> handles CI status, conflicts, and squash-merges approved PRs</li>
        <li><strong>LORE</strong> writes ADRs and updates CHANGELOG.md after each merge</li>
        <li>The Coder workspace is <strong>torn down</strong> after merge — no lingering state</li>
      </ol>

      {/* ── Step 6: Logs ── */}
      <StepHeading step="6" id="logs">What the Logs Look Like</StepHeading>
      <p>From open issue to merged PR. No human intervention. Each task runs in its own ephemeral Coder workspace.</p>
      <CodeBlock lang="bash">{`INFO  Starting REAL End-to-End Orchestration
INFO  Loaded 6 worker slots: [nexus, forge-1, forge-2, sentinel, vessel, lore]
INFO  Coder deployment reachable: https://coder.your-org.com
INFO  Found 3 open issues
INFO  Assigning issue #1 to forge-1  ->  T-001
INFO  Provisioning Coder workspace: forge-1/T-001
INFO  Workspace ready: forge-1/T-001 (template: openflows-agent)
INFO  Spawning code agent for forge-1 inside workspace
INFO  PLAN.md written - spawning SENTINEL for review
INFO  Contract AGREED - implementation starting
INFO  Worker forge-1 completed - PR opened: #1
INFO  CI status: success for PR #1
INFO  PR #1 merged successfully
INFO  LORE: ADR-001 written and committed
INFO  Tearing down Coder workspace: forge-1/T-001`}</CodeBlock>

      {/* ── Next Steps ── */}
      <h2 id="next-steps">Next Steps</h2>
      <p>Now that the team is running with ephemeral Coder workspaces, keep going:</p>
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
        If the doctor reports a missing dependency, Coder connectivity issue, or NEXUS fails to
        provision workspaces, start with the <a href="/docs/faq">FAQ</a> or open a discussion on
        <a href="https://github.com/The-AgenticFlow/OpenFlows/discussions" target="_blank" rel="noopener noreferrer">GitHub Discussions</a>.
      </Callout>

      <FeedbackFooter />
    </DocsLayout>
  )
}