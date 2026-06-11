import Layout from '@/organisms/Layout/Layout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'
import styles from './Demos.module.css'

const CARDS = [
  { icon: '💻', title: 'Terminal Simulation', desc: 'Live typewriter animation of a real OpenFlows run — NEXUS assigning, FORGE building, SENTINEL reviewing, VESSEL merging, LORE documenting.', href: '/demos/terminal' },
  { icon: '📋', title: 'Step-by-Step Walkthrough', desc: 'Follow the complete pipeline from GitHub issue to merged PR — with the actual files created at each step: PLAN.md, CONTRACT.md, STATUS.json, ADR.', href: '/demos/walkthrough' },
]

export default function DemosIndex() {
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Demos</p>
          <h1 className={styles.title}>See OpenFlows in action</h1>
          <p className={styles.sub}>Watch the full autonomous pipeline — from open GitHub issue to merged, documented pull request — with no human intervention.</p>
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
