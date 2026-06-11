import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, Accordion } from '@/molecules/DocComponents/DocComponents'

const ACCORDION_ITEMS = [
  {
    title: '1. Prerequisites',
    content: (
      <ul>
        <li><strong>Node.js 18+</strong> — Required for the GitHub MCP server and npm install</li>
        <li><strong>Claude Code CLI</strong> — <code>npm install -g @anthropic-ai/claude-code</code></li>
        <li><strong>GitHub PAT</strong> — With <code>repo</code> + <code>workflow</code> scopes</li>
        <li><strong>LLM API key</strong> — Anthropic, Fireworks, or OpenAI</li>
        <li><strong>Rust 1.70+</strong> — Only needed if building from source</li>
      </ul>
    ),
  },
  {
    title: '2. Install OpenFlows',
    content: (
      <>
        <p>The fastest way — install via npm:</p>
        <CodeBlock lang="bash">npm install -g @the-agenticflow/openflows</CodeBlock>
        <p>Or use the one-line installer (downloads pre-built binary):</p>
        <CodeBlock lang="bash">curl -fsSL https://raw.githubusercontent.com/The-AgenticFlow/AgentFlow/main/scripts/install.sh | bash</CodeBlock>
        <p>See <a href="/docs/getting-started/installation">Installation</a> for all methods (cargo, Docker, Homebrew, source).</p>
      </>
    ),
  },
  {
    title: '3. Configure Your Environment',
    content: (
      <>
        <p>Run the interactive TUI setup wizard — it writes your <code>.env</code> and <code>registry.json</code> for you:</p>
        <CodeBlock lang="bash">openflows-setup</CodeBlock>
        <p>Or configure manually. Minimum required in <code>.env</code>:</p>
        <CodeBlock lang="bash">{`DEFAULT_CLI=codex
GITHUB_REPOSITORY=your-org/your-repo
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token
ANTHROPIC_API_KEY=sk-ant-your_key
FIREWORKS_API_KEY=your_fireworks_key`}</CodeBlock>
      </>
    ),
  },
  {
    title: '4. Run the Autonomous Team',
    content: (
      <>
        <CodeBlock lang="bash">{`# Start the orchestration
openflows

# In a separate terminal — monitor workers in real-time
openflows-dashboard`}</CodeBlock>
        <Callout type="tip" title="What happens next">
          NEXUS discovers your open GitHub issues, assigns them to FORGE workers, SENTINEL reviews every code segment, VESSEL merges approved PRs, and LORE writes the ADRs. You only get notified when human input is genuinely needed.
        </Callout>
      </>
    ),
  },
]

export default function GettingStarted() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Getting Started' }]}>
      <h1>Getting Started</h1>
      <p>Get OpenFlows running in minutes. This guide walks you through installation, configuration, and your first autonomous workflow — from open GitHub issue to merged pull request.</p>

      <Accordion items={ACCORDION_ITEMS} />

      <h2>What the Logs Look Like</h2>
      <p>From open issue to merged PR in ~16 minutes. No human intervention.</p>
      <CodeBlock lang="bash">{`INFO  Starting REAL End-to-End Orchestration
INFO  Loaded 6 worker slots: [nexus, forge-1, forge-2, sentinel, vessel, lore]
INFO  Found 3 open issues
INFO  Assigning issue #1 to forge-1  →  T-001
INFO  Worktree created: forge-1/T-001
INFO  Spawning Claude Code for forge-1
INFO  PLAN.md written — spawning SENTINEL for review
INFO  Contract AGREED — implementation starting
INFO  Worker forge-1 completed — PR opened: #1
INFO  CI status: success for PR #1
INFO  PR #1 merged successfully
INFO  LORE: ADR-001 written and committed`}</CodeBlock>

      <Callout type="info" title="Next Steps">
        Configure individual agents and model routing in <a href="/docs/guides/agent-setup">Agent Setup</a>, or read the <a href="/docs/architecture/agent-roles">Agent Roles</a> reference to understand what each agent does.
      </Callout>
    </DocsLayout>
  )
}
