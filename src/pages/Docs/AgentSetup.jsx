import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, DocsTable } from '@/molecules/DocComponents/DocComponents'

const FIELD_ROWS = [
  ['<code>id</code>', 'string', 'Agent name. Used in logs, worktree names (<code>forge-1</code>), and branch names.'],
  ['<code>cli</code>', 'string', '<code>"codex"</code> or <code>"claude"</code> - which CLI to spawn for this agent.'],
  ['<code>active</code>', 'bool', 'Set <code>false</code> to exclude the agent from orchestration entirely.'],
  ['<code>instances</code>', 'int', 'Number of parallel worker slots. FORGE with <code>instances: 2</code> → <code>forge-1</code>, <code>forge-2</code>.'],
  ['<code>model_backend</code>', 'string', 'Model identifier passed to the LLM client or LiteLLM proxy.'],
  ['<code>routing_key</code>', 'string', 'LiteLLM proxy routing key. Maps to a backend model in <code>litellm_config.yaml</code>.'],
]

const MODEL_ROWS = [
  ['<code style="color:var(--color-agent-forge)">FORGE</code>', 'claude-sonnet-4-5 or kimi-k2p5', 'Primary coding agent - needs top-tier reasoning'],
  ['<code style="color:var(--color-agent-nexus)">NEXUS</code>', 'claude-sonnet-4-5 or kimi-k2p5', 'Orchestrator - needs reliable decision-making'],
  ['<code style="color:var(--color-agent-sentinel)">SENTINEL</code>', 'gemini-2.5-pro', 'Code review - strong reasoning at lower cost'],
  ['<code style="color:var(--color-agent-vessel)">VESSEL</code>', 'groq/llama-3.3-70b-versatile', 'CI/CD scripting - fast and cheap (free tier)'],
  ['<code style="color:var(--color-agent-lore)">LORE</code>', 'gpt-4o-mini', 'Documentation - lightweight task'],
]

export default function AgentSetup() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Guides', href: '/docs/guides' }, { label: 'Agent Setup' }]}>
      <h1>Agent Setup</h1>
      <p>OpenFlows agents are configured through two files: <code>.env</code> for API keys and runtime settings, and <code>orchestration/agent/registry.json</code> for team membership, worker scaling, and per-agent model routing. Run <code>openflows-setup</code> to generate both interactively.</p>

      <h2>registry.json - The Single Source of Truth</h2>
      <CodeBlock lang="json">{`{
  "default_cli": "codex",
  "team": [
    {
      "id": "nexus",
      "cli": "codex",
      "active": true,
      "instances": 1,
      "model_backend": "accounts/fireworks/models/kimi-k2p5",
      "routing_key": "nexus-key"
    },
    {
      "id": "forge",
      "cli": "codex",
      "active": true,
      "instances": 2,
      "model_backend": "accounts/fireworks/models/kimi-k2p5",
      "routing_key": "forge-key"
    },
    {
      "id": "sentinel",
      "cli": "claude",
      "active": true,
      "instances": 1,
      "model_backend": "anthropic/claude-sonnet-4-5",
      "routing_key": "sentinel-key"
    },
    {
      "id": "vessel",
      "cli": "codex",
      "active": true,
      "instances": 1,
      "model_backend": "groq/llama-3.3-70b-versatile",
      "routing_key": "vessel-key"
    },
    {
      "id": "lore",
      "cli": "codex",
      "active": true,
      "instances": 1,
      "model_backend": "openai/gpt-4o-mini",
      "routing_key": "lore-key"
    }
  ]
}`}</CodeBlock>

      <h2>Registry Fields</h2>
      <DocsTable headers={['Field', 'Type', 'Description']} rows={FIELD_ROWS} />

      <h2>Common Operations</h2>
      <p><strong>Scale FORGE workers:</strong></p>
      <CodeBlock lang="json">{'{ "id": "forge", "instances": 4 }  // → forge-1, forge-2, forge-3, forge-4'}</CodeBlock>

      <p><strong>Disable an agent:</strong></p>
      <CodeBlock lang="json">{'{ "id": "lore", "active": false }  // LORE will not be invoked'}</CodeBlock>

      <p><strong>Per-agent GitHub tokens</strong> (for rate limit isolation):</p>
      <CodeBlock lang="bash">{`# In Coder mode, GitHub identity is handled by Coder external auth.
# No per-agent PATs are required — each agent inherits its GitHub
# identity from the logged-in Coder user via the git-config module.
#
# Local mode fallback only — used when CODER_ACCESS_URL is unset:
# export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_token_with_repo_scope`}</CodeBlock>

      <h2>Recommended Model Assignments</h2>
      <DocsTable headers={['Agent', 'Recommended Model', 'Why']} rows={MODEL_ROWS} />

      <Callout type="info" title="Hot Reload">
        <code>registry.json</code> is re-read on every NEXUS poll cycle - no restart required when you change instances, models, or active flags.
      </Callout>
    </DocsLayout>
  )
}
