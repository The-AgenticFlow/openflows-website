import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, DocsTable } from '@/molecules/DocComponents/DocComponents'

const WEBHOOK_ROWS = [
  ['<code>issues</code>', 'New issue opened', 'NEXUS triages and assigns to FORGE'],
  ['<code>pull_request</code>', 'New PR created', 'SENTINEL begins code review'],
  ['<code>push</code>', 'Code pushed to main', 'VESSEL runs build and tests'],
  ['<code>issue_comment</code>', 'Comment on issue', 'NEXUS re-evaluates priority'],
  ['<code>label</code>', 'Label added/removed', 'NEXUS triggers relevant workflow'],
]

export default function WorkflowIntegration() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Guides', href: '/docs/guides' }, { label: 'Workflow Integration' }]}>
      <h1>Workflow Integration</h1>
      <p>Connect OpenFlows to your existing development workflows - GitHub Actions, CI/CD pipelines, code review gates, and notification systems.</p>

      <h2>GitHub Actions Integration</h2>
      <p>Add OpenFlows as a GitHub Action to run autonomously on repository events:</p>
      <CodeBlock lang="yaml">{`name: OpenFlows Auto-PR
on:
  issues:
    types: [opened, labeled]
  schedule:
    - cron: '*/30 * * * *'  # Check every 30 minutes

jobs:
  auto-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run OpenFlows
        uses: The-AgenticFlow/OpenFlows@main
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          anthropic-api-key: \${{ secrets.ANTHROPIC_API_KEY }}
          github-repository: \${{ github.repository }}`}</CodeBlock>

      <h2>Webhook Events</h2>
      <p>OpenFlows responds to these GitHub webhook events:</p>
      <DocsTable
        headers={['Event', 'Trigger', 'Agent Action']}
        rows={WEBHOOK_ROWS}
      />

      <h2>CI/CD Pipeline Integration</h2>
      <CodeBlock lang="bash">{`# Run OpenFlows as part of your CI pipeline
openflows daemon start --ci-mode

# CI mode behaviors:
# - No interactive prompts
# - Structured JSON output
# - Exits with code 0 on success, 1 on failure
# - Respects SENTINEL review gates`}</CodeBlock>

      <h2>Review Gates</h2>
      <p>Control when human approval is required via <code>registry.json</code>:</p>
      <CodeBlock lang="json">{`{
  "review_gates": {
    "require_approval_patterns": [
      "src/core/**",
      "Cargo.toml",
      "migrations/**"
    ],
    "auto_approve_threshold": 0.85,
    "require_approval_extensions": [".sql", ".env"]
  }
}`}</CodeBlock>

      <Callout type="warning" title="Security">
        Never commit API keys to your repository. Use GitHub Secrets for sensitive tokens. The <code>GITHUB_TOKEN</code> is automatically available in Actions but needs <code>repo</code> and <code>workflow</code> scopes for OpenFlows.
      </Callout>
    </DocsLayout>
  )
}
