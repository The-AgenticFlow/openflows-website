import Layout from '@/organisms/Layout/Layout'
import Hero from '@/organisms/Hero/Hero'
import FeaturedPost from '@/organisms/FeaturedPost/FeaturedPost'
import RecentNews from '@/organisms/RecentNews/RecentNews'
import Stories from '@/organisms/Stories/Stories'
import GetStartedBanner from '@/organisms/GetStartedBanner/GetStartedBanner'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <FeaturedPost />
      <RecentNews />
      <Stories />
      
      {/* About Section */}
      <section className="about-home-section" style={{ paddingBlock: '8rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>About</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '500', marginBottom: '2.5rem', lineHeight: '1.2' }}>Our mission is to build artificial general intelligence that benefits all of humanity.</h2>
              <a href="/about" style={{ color: '#fff', textDecoration: 'none', borderBottom: '1px solid #666' }}>Read about our mission ›</a>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000" alt="About Openflows" style={{ width: '100%', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </section>

      <GetStartedBanner />
    </Layout>
  )
}
