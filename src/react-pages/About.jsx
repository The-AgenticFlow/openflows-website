import Layout from '@/organisms/Layout/Layout'
import styles from '../pages/About.module.css'

const STATS = [
  { value: '5', label: 'Specialized agents' },
  { value: '24/7', label: 'Autonomous operation' },
  { value: '~16min', label: 'Issue to merged PR' },
  { value: 'MIT', label: 'Open source license' },
]

const VALUES = [
  {
    title: 'Autonomous by default',
    desc: 'The team runs without human input. NEXUS only reaches out when it genuinely needs you - spec ambiguity, security concerns, or resource limits.',
  },
  {
    title: 'Each agent has an identity',
    desc: 'Every agent gets its own GitHub account. They create branches, open PRs, and review code - just like human developers on your team.',
  },
  {
    title: 'Built for resilience',
    desc: 'Flow recovery detects orphaned tickets, stale workers, and unmerged PRs on every cycle. The pipeline resumes at the correct phase automatically.',
  },
  {
    title: 'Model-agnostic, adversarial by design',
    desc: 'You choose the model behind each agent. NEXUS can run Claude, FORGE can run Kimi, SENTINEL can run Gemini. Different models create natural adversarial behavior - the reviewer catches what the builder misses.',
  },
  {
    title: 'Open source, MIT licensed',
    desc: 'The entire orchestration engine - from PocketFlow core to the TUI setup wizard - is on GitHub. Install via npm, cargo, Docker, or a one-line curl installer.',
  },
]

export default function About() {
  return (
    <Layout>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>About OpenFlows</p>
          <h1 className={styles.heroTitle}>
            Orchestration on top of your<br className={styles.br} /> Coder environment.
          </h1>
          <p className={styles.heroSub}>
            OpenFlows sits on top of Coder so your engineering team can focus on
            architecture. Five specialized AI agents coordinate through a Redis-backed state
            machine to take GitHub issues all the way to merged, documented pull requests —
            safely, securely, and with full governance.
          </p>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className={styles.statsBar}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {STATS.map(({ value, label }) => (
              <div key={label} className={styles.statItem}>
                <span className={styles.statValue}>{value}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision - text left, image right ── */}
      <section className={styles.split}>
        <div className={styles.container}>
          <div className={styles.splitGrid}>
            <div className={styles.splitText}>
              <p className={styles.eyebrow}>The big idea</p>
              <h2 className={styles.splitHeading}>Your team focuses on architecture</h2>
              <p className={styles.splitDesc}>
                Coder governs where agents run. OpenFlows governs how they coordinate. Each AI
                agent gets their own GitHub account and identity — they create branches, open PRs,
                review code, run CI/CD, and deploy, just like human developers. NEXUS (the
                orchestrator) notifies you only when necessary: spec ambiguity, security concerns,
                or resource limits. Otherwise, the agentic dev team runs autonomously within your
                governed Coder environment. You wake up to completed features, reviewed PRs, and
                updated documentation.
              </p>
              <div className={styles.linkRow}>
                <a href="/docs/architecture" className={styles.textLink}>Architecture Overview ›</a>
                <a
                  href="https://github.com/The-AgenticFlow/OpenFlows"
                  className={styles.textLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub ›
                </a>
              </div>
            </div>
            <div className={styles.splitImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=900"
                alt="Engineering team collaborating"
                className={styles.splitImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pull quote ── */}
      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <blockquote className={styles.quote}>
            "Coder governs where agents run. OpenFlows governs how they coordinate.
            Code is the output. Architecture is the product."
          </blockquote>
        </div>
      </section>

      {/* ── Full-width team image ── */}
      <section className={styles.imageSection}>
        <div className={styles.container}>
          <div className={styles.fullImageWrap}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1400"
              alt="Developers collaborating"
              className={styles.fullImage}
            />
          </div>
        </div>
      </section>

      {/* ── Values grid ── */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>What we stand for</p>
          <h2 className={styles.valuesHeading}>Built on clear principles</h2>
          <div className={styles.valuesGrid}>
            {VALUES.map(({ title, desc }) => (
              <div key={title} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{title}</h3>
                <p className={styles.valueDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open source - image left, text right ── */}
      <section className={styles.split}>
        <div className={styles.container}>
          <div className={`${styles.splitGrid} ${styles.splitReverse}`}>
            <div className={styles.splitImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=900"
                alt="Developers collaborating on open source"
                className={styles.splitImage}
              />
            </div>
            <div className={styles.splitText}>
              <p className={styles.eyebrow}>Open Source</p>
              <h2 className={styles.splitHeading}>MIT licensed, community driven</h2>
              <p className={styles.splitDesc}>
                OpenFlows is fully open source. The project is maintained by The AgenticFlow
                team and welcomes contributions from the community. Install via npm, cargo,
                Homebrew, Docker, or a one-line curl installer. The entire orchestration
                engine - from PocketFlow core to the TUI setup wizard - is available on GitHub.
              </p>
              <div className={styles.linkRow}>
                <a
                  href="https://github.com/The-AgenticFlow/OpenFlows"
                  className={styles.textLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the repository ›
                </a>
                <a href="/docs/getting-started/installation" className={styles.textLink}>
                  Installation Guide ›
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  )
}
