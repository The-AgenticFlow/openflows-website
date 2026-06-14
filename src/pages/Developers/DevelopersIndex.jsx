import Layout from '@/organisms/Layout/Layout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'
import styles from './Developers.module.css'

const CARDS = [
  { icon: '🔌', title: 'API Explorer', desc: 'Test OpenFlows REST endpoints interactively - authenticate, fire requests, and inspect responses without leaving the browser.', href: '/developers/api-explorer' },
  { icon: '🔗', title: 'Integration Guides', desc: 'Connect OpenFlows to GitHub Actions, LiteLLM proxy, Redis, Docker Compose, and your existing CI/CD stack.', href: '/developers/integrations' },
  { icon: '⭐', title: 'GitHub Repository ↗', desc: 'Full source code, issues, discussions, and releases. MIT licensed. Built in Rust with Tokio, reqwest, and fred (Redis).', href: 'https://github.com/The-AgenticFlow/AgentFlow' },
  { icon: '🏗️', title: 'Architecture Reference', desc: 'PocketFlow engine, SharedStore keys, crate structure, and the full data flow from GitHub issue to merged PR.', href: '/docs/architecture/system-design' },
]

export default function DevelopersIndex() {
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Developers</p>
          <h1 className={styles.title}>Developer Resources</h1>
          <p className={styles.sub}>Everything you need to integrate with OpenFlows - API explorer, integration guides, and the full source code on GitHub.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <DocCards cards={CARDS} />
        </div>
      </section>
    </Layout>
  )
}
