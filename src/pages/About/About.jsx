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
            Openflows is an AI research and development company. Our mission is 
            to ensure that artificial general intelligence benefits all of humanity, 
            starting with the autonomous orchestration of development workflows.
          </p>
        </div>
      </section>

      <section className={styles.visionSection}>
        <div className={styles.container}>
          <div className={styles.visionGrid}>
            <div className={styles.visionText}>
              <h2 className={styles.visionHeading}>Our vision for the future of AGI</h2>
              <p className={styles.visionDescription}>
                Our mission is to build artificial general intelligence 
                (AGI) systems that are generally smarter than humans — 
                tools that can think, code, and solve problems with the 
                context and nuance of a senior software engineer.
              </p>
              <div className={styles.actions}>
                <a href="/research" className={styles.visionLink}>Our plan for AGI</a>
                <a href="/charter" className={styles.visionLink}>Our Charter ›</a>
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
            "We are building safe and beneficial AGI, but will also consider our 
            mission fulfilled if our work aids others to achieve this outcome."
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
