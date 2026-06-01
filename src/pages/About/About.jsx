import Layout from '@/organisms/Layout/Layout'
import styles from './About.module.css'

export default function About() {
  return (
    <Layout>
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <p className={styles.eyebrow}>Company</p>
          <h1 className={styles.title}>About</h1>
          <p className={styles.subtitle}>
            Openflows is an autonomous orchestration company. Our mission is 
            to empower software teams through the robust coordination of 
            specialized AI agents and programmatic state management.
          </p>
        </div>
      </section>

      <section className={styles.visionSection}>
        <div className={styles.container}>
          <div className={styles.visionGrid}>
            <div className={styles.visionText}>
              <h2 className={styles.visionHeading}>Unlocking the potential of multi-agent engineering</h2>
              <p className={styles.visionDescription}>
                We believe the future of software development lies in the 
                orchestration of specialized agents. By combining builders (FORGE) 
                and reviewers (SENTINEL) into a programmatic logic harness, we 
                eliminate the variance of single-agent code generation.
              </p>
              <div className={styles.actions}>
                <a href="#architecture" className={styles.visionLink}>Our Architecture ›</a>
                <a href="https://github.com/The-AgenticFlow/Openflows" className={styles.visionLink} target="_blank" rel="noopener noreferrer">View on GitHub</a>
              </div>
            </div>
            <div className={styles.visionImageWrap}>
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000" 
                alt="AI Neural Network Visualization" 
                className={styles.visionImage} 
              />
              <p className={styles.imageCaption}>Illustration via OpenSource Community</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <p className={styles.quoteText}>
            "Our goal is to build safe, deterministic autonomous orchestration 
            that empowers teams to focus on architecture while AI handles 
            the implementation lifecycle."
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
              <h2 className={styles.structureHeading}>Our structure</h2>
              <p className={styles.structureDescription}>
                Openflows consists of the nonprofit Openflows Foundation and 
                the for-profit Openflows Group. The Foundation governs the 
                Group, which operates as a public benefit corporation. The 
                Openflows mission advances through the combined impact 
                of both organizations.
              </p>
              <a href="/charter" className={styles.structureLink}>Our structure ›</a>
            </div>
            <div className={styles.structureImageWrap}>
              <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800" 
                alt="Minimal landscape representing structure" 
                className={styles.structureImage} 
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
