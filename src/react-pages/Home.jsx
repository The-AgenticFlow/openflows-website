import Layout from '@/organisms/Layout/Layout'
import Hero from '@/organisms/Hero/Hero'
import TrustBar from '@/organisms/TrustBar/TrustBar'
import FeatureSteps from '@/organisms/FeatureSteps/FeatureSteps'
import FlowVisual from '@/organisms/FlowVisual/FlowVisual'
import IntegrationsGrid from '@/organisms/IntegrationsGrid/IntegrationsGrid'
import UseCaseTabs from '@/organisms/UseCaseTabs/UseCaseTabs'
import IndustryCards from '@/organisms/IndustryCards/IndustryCards'
import RecentNews from '@/organisms/RecentNews/RecentNews'
import Stories from '@/organisms/Stories/Stories'
import FAQ from '@/organisms/FAQ/FAQ'
import GetStartedBanner from '@/organisms/GetStartedBanner/GetStartedBanner'

export default function Home() {
  return (
    <Layout>
      <Hero />
      <TrustBar />
      <FeatureSteps />
      <FlowVisual />
      <IntegrationsGrid />
      <UseCaseTabs />
      <IndustryCards />
      <RecentNews />
      <Stories />
      <FAQ />
      <GetStartedBanner />
    </Layout>
  )
}
