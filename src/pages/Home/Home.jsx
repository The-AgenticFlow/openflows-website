import Layout from '@/organisms/Layout/Layout'
import Hero from '@/organisms/Hero/Hero'
import FlowDiagram from '@/organisms/FlowDiagram/FlowDiagram'
import RecentNews from '@/organisms/RecentNews/RecentNews'
import Stories from '@/organisms/Stories/Stories'
import FAQ from '@/organisms/FAQ/FAQ'
import GetStartedBanner from '@/organisms/GetStartedBanner/GetStartedBanner'
import styles from './Home.module.css'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <FlowDiagram />
      <RecentNews />

      {/* About Section */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <p className={styles.aboutEyebrow}>About</p>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <h2 className={styles.aboutHeading}>
                OpenFlows is an autonomous AI development team that runs itself - 24/7, on your GitHub repo.
              </h2>
              <p className={styles.aboutDesc}>
                Five specialized agents - NEXUS, FORGE, SENTINEL, VESSEL, and LORE - collaborate through a
                Redis-backed state machine to take GitHub issues all the way to merged, documented pull requests.
                You stay as the product owner. The team handles the rest.
              </p>
              <a href="/about" className={styles.aboutLink}>Read about our mission ›</a>
            </div>
            <div className={styles.aboutImageWrap}>
              <img src="https://www.nutshell.com/wp-content/uploads/2025/11/best_crm_for_contractors.webp" alt="About OpenFlows" className={styles.aboutImage} />
            </div>
          </div>
        </div>
      </section>

      <Stories />
      <FAQ />
      <GetStartedBanner />
    </Layout>
  )
}
