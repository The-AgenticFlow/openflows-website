import Layout from '@/organisms/Layout/Layout'
import styles from './About.module.css'

export default function About() {
  return (
    <Layout>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>About</p>
          <h1 className={styles.title}>An autonomous AI development team that runs itself.</h1>
          <p className={styles.subtitle}>
            OpenFlows is a squad of specialized AI agents — written in Rust — that discovers
            your GitHub issues, writes code, reviews it, opens pull requests, and merges them.
            All without human intervention. You stay as the product owner.
          </p>
        </div>
      </section>

      <section className={styles.visionSection}>
        <div className={styles.container}>
          <div className={styles.visionGrid}>
            <div className={styles.visionText}>
              <h2 className={styles.visionHeading}>The big idea: you stay the product owner</h2>
              <p className={styles.visionDescription}>
                Each AI agent gets their own GitHub account and identity. They create branches,
                open PRs, review code, run CI/CD, and deploy — just like human developers.
                NEXUS (the orchestrator) notifies you only when necessary: spec ambiguity,
                security concerns, or resource limits. Otherwise, the team runs autonomously.
                You wake up to completed features, reviewed PRs, and updated documentation.
              </p>
              <div className={styles.actions}>
                <a href="/docs/architecture" className={styles.visionLink}>Architecture Overview ›</a>
                <a href="https://github.com/The-AgenticFlow/AgentFlow" className={styles.visionLink} target="_blank" rel="noopener noreferrer">View on GitHub ›</a>
              </div>
            </div>
            <div className={styles.visionImageWrap}>
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000" 
                alt="AI Neural Network Visualization" 
                className={styles.visionImage} 
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <p className={styles.quoteText}>
            "Imagine having a complete engineering team — Scrum Master, Senior Developer,
            Security Auditor, DevOps Engineer, and Technical Writer — that works 24/7 to turn
            your GitHub issues into production-ready code and pull requests."
          </p>
        </div>
      </section>

      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.teamImageWrap}>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
              alt="The team collaborating" 
              className={styles.teamImage} 
            />
          </div>
        </div>
      </section>

      <section className={styles.structureSection}>
        <div className={styles.container}>
          <div className={styles.structureGrid}>
            <div className={styles.structureContent}>
              <h2 className={styles.structureHeading}>Open source, MIT licensed</h2>
              <p className={styles.structureDescription}>
                OpenFlows is fully open source under the MIT license. The project is maintained
                by The AgenticFlow team and welcomes contributions from the community.
                Install via npm, cargo, Homebrew, Docker, or a one-line curl installer.
                The entire orchestration engine — from PocketFlow core to the TUI setup wizard —
                is available on GitHub.
              </p>
              <a href="https://github.com/The-AgenticFlow/AgentFlow" className={styles.structureLink} target="_blank" rel="noopener noreferrer">View the repository ›</a>
            </div>
            <div className={styles.structureImageWrap}>
              <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800" 
                alt="Open source collaboration" 
                className={styles.structureImage} 
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
