import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, TabSwitcher } from '@/molecules/DocComponents/DocComponents'

const TABS = [
  {
    label: 'npm (Recommended)',
    content: (
      <>
        <h3>Install via npm</h3>
        <p>The easiest way to install on any platform with Node.js 18+.</p>
        <CodeBlock lang="bash">{`npm install -g @the-agenticflow/openflows
openflows --version
openflows-setup
openflows
openflows-dashboard
openflows-doctor`}</CodeBlock>
        <Callout type="info" title="Prerequisites">
          Node.js 18+, Claude Code CLI (<code>npm install -g @anthropic-ai/claude-code</code>), and a GitHub PAT with <code>repo</code> + <code>workflow</code> scopes.
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
        <CodeBlock lang="bash">curl -fsSL https://raw.githubusercontent.com/The-AgenticFlow/AgentFlow/main/scripts/install.sh | bash</CodeBlock>
        <p>After install, run <code>openflows-setup</code> to configure your environment.</p>
      </>
    ),
  },
  {
    label: 'Cargo',
    content: (
      <>
        <h3>Install via Cargo</h3>
        <p>Requires Rust 1.70+.</p>
        <CodeBlock lang="bash">{`cargo install openflows
openflows-setup
openflows`}</CodeBlock>
      </>
    ),
  },
  {
    label: 'Docker',
    content: (
      <>
        <h3>Docker</h3>
        <p>Run OpenFlows in a container. Mounts your config directory for persistence.</p>
        <CodeBlock lang="bash">{`docker run -it --rm \\
  -v "$HOME/.agentflow:/home/openflows/.agentflow" \\
  -e ANTHROPIC_API_KEY=your_key \\
  -e GITHUB_PERSONAL_ACCESS_TOKEN=your_token \\
  -e GITHUB_REPOSITORY=owner/repo \\
  ghcr.io/the-agenticflow/openflows:latest`}</CodeBlock>
        <p>Or use Docker Compose with the LiteLLM proxy and Redis:</p>
        <CodeBlock lang="bash">{`git clone https://github.com/The-AgenticFlow/AgentFlow.git
cd AgentFlow
cp .env.example .env  # fill in your keys
docker compose up`}</CodeBlock>
      </>
    ),
  },
  {
    label: 'From Source',
    content: (
      <>
        <h3>Build from Source</h3>
        <p>Requires Rust 1.70+ and Node.js 18+.</p>
        <CodeBlock lang="bash">{`git clone https://github.com/The-AgenticFlow/AgentFlow.git
cd AgentFlow
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
      <p>OpenFlows ships pre-built binaries for Linux and macOS. Choose the method that fits your workflow.</p>

      <TabSwitcher tabs={TABS} />

      <h2>Required Environment Variables</h2>
      <CodeBlock lang="bash">{`# Minimum required - copy .env.example to .env and fill these in
GITHUB_REPOSITORY=owner/repo
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
ANTHROPIC_API_KEY=sk-ant-your_key_here   # for Claude Code (FORGE agent)
DEFAULT_CLI=codex                         # or "claude"`}</CodeBlock>

      <h2>Verify Installation</h2>
      <CodeBlock lang="bash">{`$ openflows --version
openflows 1.0.0

$ openflows-doctor
✓ Rust toolchain: 1.88.0
✓ Node.js: v20.11.0
✓ Claude Code CLI: installed
✓ Git: 2.44.0
✓ GitHub token: configured
✓ ANTHROPIC_API_KEY: set
✓ GITHUB_REPOSITORY: owner/repo`}</CodeBlock>

      <Callout type="tip" title="Next Step">
        Run <code>openflows-setup</code> for the interactive TUI wizard - it guides you through all configuration options and writes your <code>.env</code> and <code>registry.json</code> files.
      </Callout>
    </DocsLayout>
  )
}
