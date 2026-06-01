import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'

const CARDS = [
  { icon: '🔌', title: 'Endpoints', desc: 'REST API endpoints for agents, tasks, and workflows — with curl examples and response schemas.', href: '/docs/api/endpoints' },
  { icon: '🔑', title: 'Authentication', desc: 'API key generation, scopes, and security best practices.', href: '/docs/api/authentication' },
]

export default function ApiHome() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'API Reference' }]}>
      <h1>API Reference</h1>
      <p>OpenFlows exposes a REST API for programmatic control of agents, tasks, and workflows.</p>
      <DocCards cards={CARDS} />
    </DocsLayout>
  )
}
