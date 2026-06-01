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
      <GetStartedBanner />
    </Layout>
  )
}
