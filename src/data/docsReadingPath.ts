export const DOCS_READING_PATH = [
  { label: 'What is OpenFlows', href: '/docs/introduction/what-is-openflows', summary: 'The product and the problem it solves.' },
  { label: 'How OpenFlows works', href: '/docs/introduction/how-it-works', summary: 'Follow an issue through the agent team.' },
  { label: 'Components and interactions', href: '/docs/architecture/components-and-interactions', summary: 'See the system boundaries and who talks to whom.' },
  { label: 'Manager runtime', href: '/docs/architecture/manager-runtime', summary: 'Understand registration and workspace control.' },
  { label: 'Credentials and trust', href: '/docs/architecture/credentials', summary: 'Learn which credential belongs to each boundary.' },
  { label: 'Hooks and A2A', href: '/docs/architecture/hooks-and-a2a', summary: 'See event delivery and worker verification.' },
  { label: 'Installation', href: '/docs/getting-started/installation', summary: 'Prepare and configure a deployment.' },
  { label: 'First issue walkthrough', href: '/docs/getting-started/first-issue', summary: 'Run a complete workflow.' },
  { label: 'Operations and monitoring', href: '/docs/guides/operations', summary: 'Keep the system healthy and recover failures.' },
] as const;
