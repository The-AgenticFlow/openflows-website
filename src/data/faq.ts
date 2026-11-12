// Frequently asked questions, shared by the /faq page and the homepage.
// Answers are small HTML fragments so they can link to the docs.

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'product',
    title: 'The product',
    items: [
      {
        id: 'what-is-openflows',
        q: 'What is OpenFlows, and how does it relate to Coder?',
        a: '<p>OpenFlows is an autonomous AI software team that turns GitHub issues into reviewed pull requests. Coder hosts the isolated workspaces where the agents run; OpenFlows decides how they coordinate. Manager owns organizations, tenants, workspace lifecycle, runtime identity and credential brokerage, and Nexus coordinates planning, review and delivery inside each tenant.</p>',
      },
      {
        id: 'open-source',
        q: 'Is OpenFlows open source?',
        a: '<p>Yes. OpenFlows is MIT licensed and self-hosted on your own Coder environment. You can read the code, run it, change it and <a href="/docs/contributing">contribute</a>.</p>',
      },
      {
        id: 'agent-loop',
        q: 'How does an issue become a merged pull request?',
        a: '<p>NEXUS turns a GitHub issue into a ticket and assigns a FORGE worker. FORGE writes a plan and stops until SENTINEL approves it, then implements it and opens a pull request. SENTINEL reviews the change, VESSEL merges it once checks pass, and LORE records what was decided. See <a href="/docs/introduction/how-it-works">How OpenFlows works</a>.</p>',
      },
      {
        id: 'write-code',
        q: 'Do I still review the code?',
        a: '<p>You decide how much. Humans own the issues, the specs and the gates that need a person, and every pull request stays reviewable on GitHub. When an agent hits an ambiguous spec or an unresolvable conflict, the ticket is escalated to a human instead of guessed at.</p>',
      },
      {
        id: 'cost',
        q: 'How much does OpenFlows cost to run?',
        a: '<p>OpenFlows itself is free. Your cost is your own infrastructure and model usage. You control it by choosing a model per role, for example a more careful model for the reviewer and a general coding model for the builder.</p>',
      },
    ],
  },
  {
    id: 'models',
    title: 'Models and data',
    items: [
      {
        id: 'models',
        q: 'Which models can OpenFlows use?',
        a: '<p>You enable models in the Coder AI settings and assign one to each role in the agent registry. Calls go through your own model gateway in the control plane, so you choose which models your team can use and can switch a role to another model without a restart.</p>',
      },
      {
        id: 'ai-calls',
        q: 'Where do AI calls happen?',
        a: '<p>Model access follows the configured Coder and agent runtime settings. Manager brokers infrastructure credentials. A workspace can receive a scoped bootstrap bundle and short-lived GitHub installation tokens. See the <a href="/docs/architecture/credentials">credential flow</a>.</p>',
      },
      {
        id: 'third-parties',
        q: 'Is my code sent to third parties?',
        a: '<p>Code is available to the workspace and to the model provider you configure. GitHub also receives repository API and Git traffic. Review the provider, Coder and GitHub data paths before you deploy on sensitive repositories.</p>',
      },
      {
        id: 'private-repos',
        q: 'Can I run OpenFlows on a private repository?',
        a: '<p>Yes, when the GitHub App installation has access to that repository. Manager checks that the repository belongs to the tenant\'s organization and brokers short-lived, scoped installation tokens. Human GitHub OAuth is used to sign in, not as the runtime Git token.</p>',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security and review',
    items: [
      {
        id: 'workspace',
        q: 'How does an agent act inside a workspace?',
        a: '<p>Each agent runs in its own isolated, disposable Coder workspace. It registers with Manager, uses tenant-scoped runtime credentials and exchanges task messages with Nexus through the hook and A2A path. Its authority is limited to its tenant, workspace, repository and purpose.</p>',
      },
      {
        id: 'sentinel',
        q: 'How does SENTINEL decide whether to approve work?',
        a: '<p>SENTINEL checks the work for security holes, quality issues and missing tests against the agreed plan. It reviews from its own workspace and never touches the builder\'s files. When it needs proof, it asks for an allowlisted command to be run in FORGE\'s workspace. When in doubt, it does not approve.</p>',
      },
      {
        id: 'air-gapped',
        q: 'Can I run OpenFlows air-gapped or on-premises?',
        a: '<p>You can self-host Manager, PostgreSQL, Redis and Coder on your own infrastructure. The GitHub integration needs network access to GitHub for OAuth, App installation, webhooks and API calls, so a fully air-gapped deployment is not supported today.</p>',
      },
    ],
  },
  {
    id: 'operations',
    title: 'Running it',
    items: [
      {
        id: 'stuck',
        q: 'What happens if work gets stuck or fails?',
        a: '<p>A reconciliation loop re-reads the system on a steady cadence, advances every ticket and repairs what it can, with a limited number of retries. When retries run out, the ticket is parked and escalated to a human with a notification, instead of failing silently.</p>',
      },
      {
        id: 'conflicts',
        q: 'What happens when there are merge conflicts?',
        a: '<p>VESSEL watches CI and detects conflicts early. Fixable conflicts go back to the same FORGE worker with its context intact. A conflict that cannot be resolved is escalated to a human.</p>',
      },
      {
        id: 'parallel',
        q: 'Can several workers run at once?',
        a: '<p>Yes. The agent registry sets how many workers a role may run at once. OpenFlows runs a fleet of worker workspaces in parallel and assigns work to whichever one is free.</p>',
      },
      {
        id: 'after-task',
        q: 'What happens to workspaces after a task?',
        a: '<p>Worker workspaces are short-lived. They are provisioned when work is assigned and can be torn down when no longer needed. Tokens expire or rotate; verify workspace teardown and credential revocation in your own operations.</p>',
      },
      {
        id: 'extend',
        q: 'How do I change the configuration or add a skill?',
        a: '<p>Adding a skill, connecting an MCP server or enabling another model is a configuration change in the agent registry, with no restart. Adding a brand-new role is the one change that touches the code. See the <a href="/docs/guides">guides</a>.</p>',
      },
    ],
  },
  {
    id: 'help',
    title: 'Getting help',
    items: [
      {
        id: 'broken',
        q: 'Where do I go if something is broken?',
        a: '<p>Start with the <a href="/docs/guides/troubleshooting">Troubleshooting</a> guide, which covers setup failures, Coder connectivity, stuck tickets and merge conflicts. If that does not solve it, ask on <a href="https://discord.gg/gDhK2RQZpY" target="_blank" rel="noopener noreferrer">Discord</a> or open an issue on GitHub.</p>',
      },
      {
        id: 'api',
        q: 'Is there an API reference?',
        a: '<p>OpenFlows is driven through the <a href="/docs/reference/command-surface">command surface</a>, which covers the Console and its command-line equivalents. There is no separate public HTTP API documented yet.</p>',
      },
      {
        id: 'security-report',
        q: 'How do I report a security issue?',
        a: '<p>Report it privately through <a href="https://github.com/The-AgenticFlow/OpenFlows/security/advisories/new" target="_blank" rel="noopener noreferrer">GitHub security advisories</a>. Please do not open a public issue for vulnerabilities.</p>',
      },
    ],
  },
];

/** The questions shown on the homepage, in order. */
export const FAQ_HOME = ['what-is-openflows', 'open-source', 'models', 'sentinel', 'private-repos', 'cost'];

export const faqItem = (id: string) => FAQ_GROUPS.flatMap((g) => g.items).find((i) => i.id === id)!;
