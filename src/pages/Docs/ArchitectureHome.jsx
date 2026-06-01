import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'

const CARDS = [
  { icon: '🏗️', title: 'System Design', desc: 'PocketFlow engine, SharedStore state machine, data flow from issue to merged PR, and core design principles.', href: '/docs/architecture/system-design' },
  { icon: '👥', title: 'Agent Roles', desc: 'NEXUS, FORGE, SENTINEL, VESSEL, LORE — each agent\'s role, permissions, workflow, and how they interact.', href: '/docs/architecture/agent-roles' },
]

export default function ArchitectureHome() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'Architecture' }]}>
      <h1>Architecture</h1>
      <p>Understanding the design principles and component structure of OpenFlows.</p>
      <DocCards cards={CARDS} />
    </DocsLayout>
  )
}
