import Layout from '@/organisms/Layout/Layout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'
import styles from './UseCases.module.css'

const CARDS = [
  { icon: '🌐', title: 'Web Development', desc: 'A 2-person startup ships 40 features in a month. FORGE implements, SENTINEL reviews every segment, VESSEL merges — no PR review queue, no context switching.', href: '/use-cases/web-development' },
  { icon: '🔧', title: 'DevOps Automation', desc: 'VESSEL fully automates CI/CD on GitHub Actions. Conflict rework loops eliminate manual rebase churn. Green CI → squash merge, automatically.', href: '/use-cases/devops' },
]

export default function UseCasesIndex() {
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Use Cases</p>
          <h1 className={styles.title}>Real teams, real results</h1>
          <p className={styles.sub}>See how development teams use OpenFlows to eliminate manual churn and ship faster with five autonomous AI agents handling their GitHub backlog.</p>
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
