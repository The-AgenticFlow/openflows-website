import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'

const CARDS = [
  { icon: '🤖', title: 'Agent Setup', desc: 'Configure NEXUS, FORGE, SENTINEL, LORE, and VESSEL - registry.json, model routing, GitHub tokens, and worker scaling.', href: '/docs/guides/agent-setup' },
]

export default function GuidesHome() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Guides' }]}>
      <h1>Guides</h1>
      <p>Practical guides for configuring and integrating OpenFlows into your development workflow.</p>
      <DocCards cards={CARDS} />
    </DocsLayout>
  )
}
