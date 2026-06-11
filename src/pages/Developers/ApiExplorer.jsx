import { useState } from 'react'
import Layout from '@/organisms/Layout/Layout'
import { Callout, DocsTable } from '@/molecules/DocComponents/DocComponents'
import styles from './Developers.module.css'

const MOCK_RESPONSES = {
  'GET /api/v1/agents': `{
  "agents": [
    {"id": "nexus",    "role": "orchestrator", "status": "active",  "uptime": "14h 32m"},
    {"id": "forge-1",  "role": "builder",      "status": "working", "ticket": "T-004"},
    {"id": "forge-2",  "role": "builder",      "status": "idle",    "ticket": null},
    {"id": "sentinel", "role": "reviewer",     "status": "standby", "ticket": null},
    {"id": "vessel",   "role": "devops",       "status": "monitor", "pr": 12},
    {"id": "lore",     "role": "documenter",   "status": "idle",    "ticket": null}
  ],
  "total": 6
}`,
  'GET /api/v1/tasks': `{
  "tasks": [
    {"id": "T-004", "status": "in_progress", "worker": "forge-1", "issue": 42},
    {"id": "T-003", "status": "merged",      "worker": "forge-2", "pr": 11},
    {"id": "T-002", "status": "merged",      "worker": "forge-1", "pr": 10}
  ],
  "total": 3
}`,
  'POST /api/v1/tasks': `{
  "task_id": "T-005",
  "status": "open",
  "created_at": "2026-06-01T12:00:00Z",
  "message": "Task created and queued for NEXUS assignment"
}`,
}

const ENDPOINT_ROWS = [
  ['<code>GET</code>', '<code>/api/v1/agents</code>', 'List all agents and their status'],
  ['<code>GET</code>', '<code>/api/v1/tasks</code>', 'List all tasks with filter support'],
  ['<code>POST</code>', '<code>/api/v1/tasks</code>', 'Create a new task manually'],
  ['<code>PUT</code>', '<code>/api/v1/agents/{id}</code>', 'Update agent configuration'],
  ['<code>DELETE</code>', '<code>/api/v1/tasks/{id}</code>', 'Cancel a pending task'],
]

export default function ApiExplorer() {
  const [method, setMethod] = useState('GET')
  const [endpoint, setEndpoint] = useState('/api/v1/agents')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState('Click "Send" to see a mock response...')
  const [status, setStatus] = useState(null)

  const handleSend = () => {
    const key = `${method} ${endpoint}`
    const mock = MOCK_RESPONSES[key]
    if (mock) {
      setResponse(mock)
      setStatus('200 OK')
    } else {
      setResponse(`{\n  "error": "No mock response for ${method} ${endpoint}"\n}`)
      setStatus('404 Not Found')
    }
  }

  return (
    <Layout>
      <div className={styles.page}>
        <p className={styles.eyebrow}>Developers</p>
        <h1 className={styles.title}>API Explorer</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Test OpenFlows API endpoints interactively. Select a method, enter an endpoint, and hit Send to see a mock response.
        </p>

        <div className="apiExplorer">
          <div className="apiForm">
            <div className="apiRow">
              <select className="apiMethod" value={method} onChange={e => setMethod(e.target.value)}>
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <input
                className="apiEndpoint"
                value={endpoint}
                onChange={e => setEndpoint(e.target.value)}
                placeholder="/api/v1/..."
              />
            </div>
            <label className="apiBodyLabel">Request Body (JSON)</label>
            <textarea
              className="apiBody"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder='{"key": "value"}'
            />
            <button className="apiSend" onClick={handleSend}>Send →</button>
          </div>
          <div className="apiResponseHeader">
            Response
            {status && (
              <span className="apiStatus">{status}</span>
            )}
          </div>
          <pre className="apiResponse">{response}</pre>
        </div>

        <Callout type="tip" title="Note">
          This explorer returns mock responses for demonstration. To interact with a real OpenFlows instance, ensure the daemon is running on <code>localhost:8080</code> with a valid API key.
        </Callout>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Available Endpoints</h2>
        <DocsTable headers={['Method', 'Endpoint', 'Description']} rows={ENDPOINT_ROWS} />
      </div>
    </Layout>
  )
}
