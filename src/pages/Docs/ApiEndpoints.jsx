import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { CodeBlock, Callout, DocsTable } from '@/molecules/DocComponents/DocComponents'

const AGENT_ROWS = [
  ['<code style="color:#2D5A27">GET</code>', '<code>/api/v1/agents</code>', 'List all active agents and their status'],
  ['<code style="color:#2D5A27">GET</code>', '<code>/api/v1/agents/{id}</code>', 'Get details for a specific agent'],
  ['<code style="color:#3a7a33">POST</code>', '<code>/api/v1/agents/{id}/restart</code>', 'Restart a stuck or idle agent'],
  ['<code style="color:#f87171">DELETE</code>', '<code>/api/v1/agents/{id}</code>', 'Stop and remove an agent'],
]

const TASK_ROWS = [
  ['<code style="color:#2D5A27">GET</code>', '<code>/api/v1/tasks</code>', 'List all tasks with filter support'],
  ['<code style="color:#2D5A27">GET</code>', '<code>/api/v1/tasks/{id}</code>', 'Get task details and execution log'],
  ['<code style="color:#3a7a33">POST</code>', '<code>/api/v1/tasks</code>', 'Create a new task manually'],
  ['<code style="color:#f59e0b">PUT</code>', '<code>/api/v1/tasks/{id}/assign</code>', 'Assign task to a specific agent'],
  ['<code style="color:#f87171">DELETE</code>', '<code>/api/v1/tasks/{id}</code>', 'Cancel a pending or in-progress task'],
]

const WORKFLOW_ROWS = [
  ['<code style="color:#2D5A27">GET</code>', '<code>/api/v1/workflows</code>', 'List configured workflows'],
  ['<code style="color:#3a7a33">POST</code>', '<code>/api/v1/workflows</code>', 'Create a new workflow definition'],
  ['<code style="color:#f59e0b">PUT</code>', '<code>/api/v1/workflows/{id}</code>', 'Update workflow configuration'],
  ['<code style="color:#2D5A27">GET</code>', '<code>/api/v1/workflows/{id}/runs</code>', 'Get execution history for a workflow'],
]

export default function ApiEndpoints() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'API Reference', href: '/docs/api' }, { label: 'Endpoints' }]}>
      <h1>API Endpoints</h1>
      <p>OpenFlows exposes a REST API on <code>localhost:8080</code> (configurable) for programmatic control.</p>

      <h2>Agents</h2>
      <DocsTable headers={['Method', 'Endpoint', 'Description']} rows={AGENT_ROWS} />

      <h2>Tasks</h2>
      <DocsTable headers={['Method', 'Endpoint', 'Description']} rows={TASK_ROWS} />

      <h2>Workflows</h2>
      <DocsTable headers={['Method', 'Endpoint', 'Description']} rows={WORKFLOW_ROWS} />

      <h2>Example Request</h2>
      <CodeBlock lang="bash">{`curl -X GET http://localhost:8080/api/v1/agents \\
  -H "Authorization: Bearer $OPENFLOWS_API_KEY" \\
  -H "Content-Type: application/json"`}</CodeBlock>

      <CodeBlock lang="json">{`{
  "agents": [
    {"id": "nexus",    "role": "orchestrator", "status": "active"},
    {"id": "forge-1",  "role": "builder",      "status": "working"},
    {"id": "sentinel", "role": "reviewer",     "status": "idle"}
  ],
  "total": 3
}`}</CodeBlock>

      <Callout type="info" title="Try It Live">
        Use the <a href="/developers/api-explorer">API Explorer</a> to interact with endpoints directly in your browser.
      </Callout>
    </DocsLayout>
  )
}
