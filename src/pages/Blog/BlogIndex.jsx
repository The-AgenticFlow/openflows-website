import Layout from '@/organisms/Layout/Layout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'
import styles from './Blog.module.css'

const POSTS = [
  { icon: '🚀', title: 'OpenFlows v1.0 — Autonomous AI Dev Team Goes Stable', desc: 'The first stable release ships with the full FORGE-SENTINEL pair harness, Redis-backed SharedStore, LiteLLM proxy routing, and a TUI setup wizard.', href: '/blog/introducing-demos' },
  { icon: '🔬', title: 'How multi-agent code review cuts PR defect rate by 3×', desc: 'A deep dive into the SENTINEL evaluation framework — the 5 criteria it checks on every code segment before approving a merge.', href: '#' },
  { icon: '⚡', title: 'Per-agent model routing: give each AI the right brain', desc: 'Route FORGE to Claude Sonnet, SENTINEL to Gemini Pro, VESSEL to Groq — all from a single registry.json. Hot-reloaded on every NEXUS poll.', href: '#' },
  { icon: '🌐', title: 'OpenFlows joins the Open Source Initiative\'s affiliate program', desc: 'We\'re proud to announce our affiliation with the OSI as part of our commitment to open, transparent, and collaborative AI tooling.', href: '#' },
]

export default function BlogIndex() {
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Blog</p>
          <h1 className={styles.title}>Product updates &amp; technical deep dives</h1>
          <p className={styles.sub}>Stories from the OpenFlows team — releases, research, and open source news.</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.container}>
          <DocCards cards={POSTS} />
        </div>
      </section>
    </Layout>
  )
}
