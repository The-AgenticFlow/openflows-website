import Layout from '@/organisms/Layout/Layout'
import { Comparison, Callout } from '@/molecules/DocComponents/DocComponents'
import styles from './UseCases.module.css'

const BEFORE = [
  'Issues sit in the backlog for days waiting for assignment',
  'Simple bug fixes take 2–4 hours end-to-end',
  'Code review blocks merges for hours',
  'Merge conflicts require manual rebase',
  'No documentation after merges',
  'Founders context-switch constantly',
]

const AFTER = [
  'NEXUS assigns tickets within seconds of discovery',
  'FORGE implements and opens PR in 15–30 minutes',
  'SENTINEL reviews every segment automatically',
  'VESSEL handles conflicts and merges when CI is green',
  'LORE writes ADRs and updates CHANGELOG after every merge',
  'Founders focus on product decisions, not PR queues',
]

export default function WebDevelopment() {
  return (
    <Layout>
      <div className={styles.page}>
        <p className={styles.eyebrow}>Use Cases</p>
        <h1 className={styles.title}>Web Development</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          How a web development team uses OpenFlows to ship features and fix bugs faster - with five AI agents handling the entire pipeline from GitHub issue to merged PR.
        </p>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>The Scenario</h2>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
          A 2-person startup maintains a React + Node.js application with a growing backlog of GitHub issues. They're spending more time reviewing PRs and fixing regressions than building new features.
        </p>

        <Comparison before={BEFORE} after={AFTER} />

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--color-text-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>The Pipeline in Practice</h2>
        <ol className={styles.stepList}>
          <li><span><strong>Issue filed</strong> - A bug is reported as a GitHub issue with reproduction steps</span></li>
          <li><span><strong>NEXUS assigns</strong> - Discovers the issue on the next poll cycle, assigns to <code>forge-1</code> as ticket T-007</span></li>
          <li><span><strong>FORGE creates worktree</strong> - Isolated branch <code>forge-1/T-007</code>, writes PLAN.md</span></li>
          <li><span><strong>SENTINEL reviews plan</strong> - Writes CONTRACT.md: AGREED - implementation starts</span></li>
          <li><span><strong>FORGE implements</strong> - Writes the fix segment by segment; SENTINEL evaluates each commit</span></li>
          <li><span><strong>SENTINEL final review</strong> - final-review.md: APPROVED - FORGE opens PR via GitHub MCP</span></li>
          <li><span><strong>VESSEL polls CI</strong> - GitHub Actions passes; VESSEL squash-merges with ticket reference</span></li>
          <li><span><strong>LORE documents</strong> - ADR written, CHANGELOG updated, committed to main</span></li>
        </ol>

        <Callout type="tip" title="Result">
          From filed issue to merged, documented PR in under 30 minutes. No human intervention. The team shipped 40 features in a single month using OpenFlows on their backlog.
        </Callout>
      </div>
    </Layout>
  )
}
