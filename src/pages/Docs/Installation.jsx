import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, TabSwitcher } from '@/molecules/DocComponents/DocComponents'

const TABS = [
  {
    label: 'Docker Compose + Coder (Recommended)',
    content: (
      <>
        <h3>Bring up the full governed stack</h3>
        <p>
          The recommended path. One Compose file starts Coder (governed execution), Redis (the
          SharedStore), a LiteLLM proxy (LLM fallback), and the OpenFlows engine — all wired
          together. Coder provisions each agent as an ephemeral Docker workspace.
        </p>
        <CodeBlock lang="bash">{`git clone https://github.com/The-AgenticFlow/OpenFlows.git
cd OpenFlows
cp .env.example .env          # fill in your repo, tokens, and Coder settings
docker compose --profile coder up -d`}</CodeBlock>
        <Callout type="info" title="What runs where">
          Coder on <code>:7080</code>, OpenFlows on <code>:3000</code>, Redis on <code>:6379</code>,
          LiteLLM on <code>:4000</code>. Coder mounts the host Docker socket to provision workspaces —
          run on a host where that is acceptable.
        </Callout>
        <p>Then configure and start the team:</p>
        <CodeBlock lang="bash">{`openflows-setup     # bootstraps Coder, pushes templates, writes .env + registry.json
openflows          # start the engine
openflows-dashboard
openflows-doctor`}</CodeBlock>
      </>
    ),
  },
  {
    label: 'npm',
    content: (
      <>
        <h3>Install the CLI via npm</h3>
        <p>The engine binaries, for any platform with Node.js 18+. Point at an external Coder server with <code>CODER_URL</code>.</p>
        <CodeBlock lang="bash">{`npm install -g @the-agenticflow/openflows
openflows --version
openflows-setup
openflows`}</CodeBlock>
        <Callout type="info" title="Prerequisites">
          Node.js 18+, a Coder server with a GitHub external auth provider (governed mode) or
          Docker/Docker Compose (local mode), and a code agent CLI (<code>claude</code>,
          <code>codex</code>, or <code>aider</code>). In governed mode GitHub identity comes from
          the logged-in Coder user.
        </Callout>
      </>
    ),
  },
  {
    label: 'One-liner',
    content: (
      <>
        <h3>One-line installer</h3>
        <p>Downloads the correct pre-built binary for your OS and architecture, installs to <code>~/.local/bin</code>.</p>
        <CodeBlock lang="bash">curl -fsSL https://raw.githubusercontent.com/The-AgenticFlow/OpenFlows/main/scripts/install.sh | bash</CodeBlock>
        <p>After install, run <code>openflows-setup</code> to bootstrap your Coder server and configure the environment.</p>
      </>
    ),
  },
  {
    label: 'Cargo',
    content: (
      <>
        <h3>Install via Cargo</h3>
        <p>For Rust developers. Requires Rust 1.70+.</p>
        <CodeBlock lang="bash">{`cargo install openflows
openflows-setup
openflows`}</CodeBlock>
      </>
    ),
  },
  {
    label: 'From Source',
    content: (
      <>
        <h3>Build from Source</h3>
        <p>Requires Rust 1.70+ and Node.js 18+.</p>
        <CodeBlock lang="bash">{`git clone https://github.com/The-AgenticFlow/OpenFlows.git
cd OpenFlows
make release        # builds all binaries
make install        # installs to ~/.local/bin
openflows-setup     # interactive setup wizard
openflows           # start the autonomous team`}</CodeBlock>
      </>
    ),
  },
]

export default function Installation() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Getting Started', href: '/docs/getting-started' }, { label: 'Installation' }]}>
      <h1>Installation</h1>
      <p>
        OpenFlows runs on top of your Coder environment. The recommended setup is the bundled Compose
        stack, which brings up Coder, Redis, LiteLLM, and the engine together. Other methods install
        the same binaries (<code>openflows</code>, <code>openflows-setup</code>,
        <code>openflows-dashboard</code>, <code>openflows-doctor</code>) — point them at an external
        Coder server with <code>CODER_URL</code>, or run agents locally as a fallback.
      </p>

      <TabSwitcher tabs={TABS} />

      <h2>Required Environment Variables</h2>
      <p>
        Whether you use the interactive TUI or manual setup, these are the variables OpenFlows needs
        to select the target repo, route agent workspaces through Coder, and invoke the GitHub MCP
        server. GitHub identity itself is <strong>not</strong> configured here.
      </p>

      <CodeBlock lang="bash">{`# ── Core ────────────────────────────────────────
GITHUB_REPOSITORY=your-org/your-repo
DEFAULT_CLI=claude                             # or "codex"
# In Coder mode the token this server uses is injected by Coder external auth.
GITHUB_MCP_CMD=npx -y @modelcontextprotocol/server-github

# ── Coder (governed execution) ───────────────────
# Setting CODER_URL switches OpenFlows from local worktrees to Coder workspaces.
CODER_URL=http://localhost:7080
CODER_ADMIN_PASSWORD=Op3nFl0ws!
USE_AI_GATEWAY=true                            # route LLM through the Coder AI Gateway
LITELLM_PROXY_URL=http://proxy:4000            # fallback for non-Anthropic providers / Local mode

# ── GitHub identity ──────────────────────────────
#        Nothing to paste: each agent workspace inherits its GitHub identity from
#        the logged-in Coder user via Coder external auth + the git-config module.
#        Git commits, the MCP server, and PRs are all auditable to that identity.

# ── LLM API Keys (LiteLLM fallback only) ─────────
#        Not needed when USE_AI_GATEWAY=true and your providers are proxied by the AI Gateway.
# ANTHROPIC_API_KEY=sk-ant-api-key-here
# OPENAI_API_KEY=sk-openai-api-key-here
# FIREWORKS_API_KEY=your_fireworks_key_here

# ── Debug / Logging ─────────────────────────────
RUST_LOG=info,agent_team=debug,pocketflow_core=debug`}</CodeBlock>

      <Callout type="info" title="GitHub identity via Coder external auth">
        Coder already authenticates each workspace owner, so OpenFlows doesn't manage GitHub
        credentials. Configure a <strong>GitHub</strong> external auth provider in Coder and include
        the <code>git-config</code> module in your workspace templates — every agent then acts under
        its own logged-in Coder user's GitHub identity.
      </Callout>

      <h2>Verify Installation</h2>
      <CodeBlock lang="bash">{`$ openflows --version
openflows 1.0.0

$ openflows-doctor
  Docker:             27.2.0
  Node.js:            v20.11.0
  Git:                2.44.0
  GitHub identity:    via Coder external auth
  GITHUB_REPOSITORY: owner/repo
  Coder server:       reachable at http://localhost:7080
  Workspace provider: coder
  AI Gateway:         enabled
  LiteLLM proxy:      reachable at http://proxy:4000
  registry.json:      valid`}</CodeBlock>

      <Callout type="tip" title="Next Step">
        Run <code>openflows-setup</code> for the interactive TUI wizard — it bootstraps your Coder
        server, pushes the <code>openflows-{`{role}`}</code> templates, and writes your
        <code>.env</code> and <code>registry.json</code> automatically. Or follow the
        <a href="/docs/getting-started">Getting Started</a> guide for the full walkthrough.
      </Callout>
    </DocsLayout>
  )
}