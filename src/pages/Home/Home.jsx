import Layout from '@/organisms/Layout/Layout'
import Hero from '@/organisms/Hero/Hero'
import FlowDiagram from '@/organisms/FlowDiagram/FlowDiagram'
import RecentNews from '@/organisms/RecentNews/RecentNews'
import Stories from '@/organisms/Stories/Stories'
import FAQ from '@/organisms/FAQ/FAQ'
import GetStartedBanner from '@/organisms/GetStartedBanner/GetStartedBanner'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <FlowDiagram />
      <RecentNews />

      {/* About Section */}
      <section className="about-home-section" style={{ paddingBlock: '8rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>About</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '500', marginBottom: '2.5rem', lineHeight: '1.2', color: 'var(--color-accent)' }}>
                OpenFlows is an autonomous AI development team that runs itself — 24/7, on your GitHub repo.
              </h2>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
                Five specialized agents — NEXUS, FORGE, SENTINEL, VESSEL, and LORE — collaborate through a
                Redis-backed state machine to take GitHub issues all the way to merged, documented pull requests.
                You stay as the product owner. The team handles the rest.
              </p>
              <a href="/about" style={{ color: 'var(--color-text-primary)', textDecoration: 'none', borderBottom: '1px solid var(--color-border)' }}>Read about our mission ›</a>
            </div>
            <div>
              <img src="https://www.nutshell.com/wp-content/uploads/2025/11/best_crm_for_contractors.webp" alt="About OpenFlows" style={{ width: '100%', borderRadius: '4px' }} />
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
