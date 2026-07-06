import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, DocsTable } from '@/molecules/DocComponents/DocComponents'

const SCOPE_ROWS = [
  ['<code>agents:read</code>', 'View agent status and configuration'],
  ['<code>agents:write</code>', 'Start, stop, and restart agents'],
  ['<code>tasks:read</code>', 'View task details and logs'],
  ['<code>tasks:write</code>', 'Create, assign, and cancel tasks'],
  ['<code>workflows:read</code>', 'View workflow definitions'],
  ['<code>workflows:write</code>', 'Create and modify workflows'],
]

export default function ApiAuthentication() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'API Reference', href: '/docs/api' }, { label: 'Authentication' }]}>
      <h1>Authentication</h1>
      <p>Secure your OpenFlows API with token-based authentication.</p>

      <h2>API Key Generation</h2>
      <CodeBlock lang="bash">{`# Generate a new API key
openflows auth generate-key

# Output:
# API Key: ofk_live_a1b2c3d4e5f6g7h8i9j0
# Store this key securely - it won't be shown again.`}</CodeBlock>

      <h2>Using Your API Key</h2>
      <p>Include the API key in the <code>Authorization</code> header of every request:</p>
      <CodeBlock lang="bash">{`curl -X GET http://localhost:8080/api/v1/agents \\
  -H "Authorization: Bearer ofk_live_your_key_here"`}</CodeBlock>

      <h2>Key Scopes</h2>
      <DocsTable headers={['Scope', 'Access']} rows={SCOPE_ROWS} />

      <Callout type="warning" title="Security">
        Never expose API keys in client-side code or commit them to version control. Use environment variables or a secret management tool.
      </Callout>
    </DocsLayout>
  )
}
