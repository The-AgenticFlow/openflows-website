import Layout from '@/organisms/Layout/Layout'
import { CodeBlock, Callout, DocsTable } from '@/molecules/DocComponents/DocComponents'
import styles from './Developers.module.css'

export default function Integrations() {
  return (
    <Layout>
      <div className={styles.page}>
        <p className={styles.eyebrow}>Developers</p>
        <h1 className={styles.title}>Integration Guides</h1>
        <p style={{ color: 'var(--color-graphite)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Connect OpenFlows to your existing development tools and workflows. Each guide provides step-by-step instructions with code samples.
        </p>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-ink)', borderBottom: '1px solid var(--color-driftwood)', paddingBottom: '0.5rem' }}>GitHub Integration</h2>
        <p style={{ color: 'var(--color-graphite)', marginBottom: '1rem' }}>OpenFlows integrates deeply with GitHub. Here's how to set up the connection:</p>
        <CodeBlock lang="bash">{`# 1. Configure GitHub external auth in your Coder deployment
# Go to: Coder dashboard → External Auth → Add GitHub provider
# This lets each workspace inherit its GitHub identity from the logged-in user

# 2. Include the git-config module in your workspace templates
# This wires git author/identity and injects the GitHub token for git ops + MCP

# 3. Set your target repository
export GITHUB_REPOSITORY="my-org/my-project"

# 4. Run the setup wizard
openflows-setup`}</CodeBlock>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-ink)', borderBottom: '1px solid var(--color-driftwood)', paddingBottom: '0.5rem' }}>LiteLLM Proxy Integration</h2>
        <p style={{ color: 'var(--color-graphite)', marginBottom: '1rem' }}>Route each agent to a different model backend using a LiteLLM proxy:</p>
        <CodeBlock lang="yaml">{`# litellm_config.yaml
model_list:
  - model_name: forge-key
    litellm_params:
      model: anthropic/claude-sonnet-4-5
      api_key: os.environ/ANTHROPIC_API_KEY

  - model_name: sentinel-key
    litellm_params:
      model: gemini/gemini-2.5-pro
      api_key: os.environ/GEMINI_API_KEY

  - model_name: vessel-key
    litellm_params:
      model: groq/llama-3.3-70b-versatile
      api_key: os.environ/GROQ_API_KEY`}</CodeBlock>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-ink)', borderBottom: '1px solid var(--color-driftwood)', paddingBottom: '0.5rem' }}>Docker Compose</h2>
        <p style={{ color: 'var(--color-graphite)', marginBottom: '1rem' }}>Run OpenFlows with Redis and LiteLLM proxy via Docker Compose:</p>
        <CodeBlock lang="yaml">{`# docker-compose.yml
services:
  openflows:
    image: ghcr.io/the-agenticflow/openflows:latest
    env_file: .env
    depends_on: [redis, proxy]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  proxy:
    image: ghcr.io/berriai/litellm:main-latest
    volumes: ["./litellm_config.yaml:/app/config.yaml"]
    ports: ["4000:4000"]
    command: ["--config", "/app/config.yaml"]`}</CodeBlock>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-ink)', borderBottom: '1px solid var(--color-driftwood)', paddingBottom: '0.5rem' }}>CLI Reference</h2>
        <CodeBlock lang="bash">{`openflows              # Start the autonomous team
openflows-setup        # Interactive TUI configuration wizard
openflows-dashboard    # Live worker monitoring dashboard
openflows-doctor       # Diagnose environment issues`}</CodeBlock>

        <Callout type="info" title="More Integrations Coming">
          We're working on integrations for Jira, Linear, GitLab, and Bitbucket. <a href="https://github.com/The-AgenticFlow/OpenFlows/issues" target="_blank" rel="noopener noreferrer">Request an integration ↗</a> on GitHub.
        </Callout>
      </div>
    </Layout>
  )
}
