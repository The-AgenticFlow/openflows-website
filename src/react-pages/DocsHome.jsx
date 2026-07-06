import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { DocCards } from '@/molecules/DocComponents/DocComponents'

const CARDS = [
  { icon: '🚀', title: 'Getting Started', desc: 'Install OpenFlows and run your first autonomous workflow in minutes.', href: '/docs/getting-started' },
  { icon: '⚙️', title: 'Installation Guide', desc: 'All install methods: npm, one-liner, cargo, Docker, Homebrew, and source.', href: '/docs/getting-started/installation' },
  { icon: '🤖', title: 'Agent Setup', desc: 'Configure NEXUS, FORGE, SENTINEL, VESSEL, and LORE - registry.json, model routing, Coder modules.', href: '/docs/guides/agent-setup' },
  { icon: '🏗️', title: 'System Design', desc: 'PocketFlow engine, SharedStore state machine, data flow from issue to merged PR.', href: '/docs/architecture/system-design' },
  { icon: '👥', title: 'Agent Roles', desc: 'Deep dive into each agent - permissions, workflows, and how they interact.', href: '/docs/architecture/agent-roles' },
  { icon: '❓', title: 'FAQ', desc: 'Answers to common questions about setup, LLM providers, Coder workspaces, and troubleshooting.', href: '/docs/faq' },
]

export default function DocsHome() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Documentation' }]}>
      <h1>Documentation</h1>
      <p>Everything you need to install, configure, and operate the OpenFlows orchestration layer on top of your Coder environment. Five agents, one pipeline, zero manual steps — all governed and auditable.</p>
      <DocCards cards={CARDS} />
    </DocsLayout>
  )
}
