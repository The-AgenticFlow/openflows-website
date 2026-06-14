import DocsLayout from '@/organisms/DocsLayout/DocsLayout'
import { Accordion } from '@/molecules/DocComponents/DocComponents'

const FAQ_ITEMS = [
  {
    title: 'What LLM providers does OpenFlows support?',
    content: <p>OpenFlows supports Anthropic (Claude), OpenAI, Google Gemini, Fireworks, and Groq out of the box via the <code>agent-client</code> crate. Each agent can use a different provider and model, configured in <code>orchestration/agent/registry.json</code>. A LiteLLM proxy is supported for advanced per-agent routing. The recommended setup is Codex CLI + Fireworks (Mode A) - no proxy needed.</p>,
  },
  {
    title: 'Can I run OpenFlows on a private repository?',
    content: <p>Yes. Your GitHub PAT needs <code>repo</code> + <code>workflow</code> scopes. Set <code>GITHUB_REPOSITORY=owner/repo</code> in your <code>.env</code>. OpenFlows treats private repos identically - it clones, creates worktrees, writes code, and opens PRs the same way. Each agent can have its own token via <code>AGENT_FORGE_GITHUB_TOKEN</code> etc. for rate limit isolation.</p>,
  },
  {
    title: 'How does SENTINEL decide whether to approve or reject code?',
    content: <p>SENTINEL evaluates against 5 criteria on every segment: correctness, security vulnerabilities, test coverage, standards compliance, and no regressions. It writes <code>segment-N-eval.md</code> after each FORGE commit and <code>final-review.md</code> at the end. SENTINEL is ephemeral - spawned fresh per evaluation - so it has no accumulated bias. It is read-only and cannot modify code.</p>,
  },
  {
    title: 'What happens if FORGE gets blocked or times out?',
    content: <p>FORGE writes a <code>STATUS.json</code> with <code>status: "BLOCKED"</code> and a specific, answerable question. NEXUS detects this on the next cycle and can re-assign the ticket or escalate. If a worker times out (default 30 min), the ticket is marked <code>failed</code> and retried up to 3 times before being marked <code>exhausted</code>. NEXUS never re-assigns an exhausted ticket.</p>,
  },
  {
    title: 'How much does OpenFlows cost to run?',
    content: <p>OpenFlows itself is free and MIT licensed. The cost is LLM API usage. A typical full cycle (NEXUS + FORGE + SENTINEL + VESSEL + LORE) uses roughly 50,000–150,000 tokens depending on task complexity. Using Fireworks with Kimi K2 for FORGE and Groq for VESSEL (free tier) can bring the per-task cost well under $0.10. Per-agent model routing via <code>registry.json</code> lets you optimize cost per role.</p>,
  },
  {
    title: 'Can I run multiple FORGE workers in parallel?',
    content: <p>Yes. Set <code>"instances": 4</code> for FORGE in <code>registry.json</code> to get <code>forge-1</code> through <code>forge-4</code> running in parallel. Each gets its own isolated Git worktree and branch. NEXUS automatically distributes tickets across idle workers. Scale is limited only by your LLM rate limits and disk space for worktrees.</p>,
  },
  {
    title: 'Is my code sent to third parties?',
    content: <p>Code context is sent only to the LLM provider you configure in <code>registry.json</code>. If you use Anthropic or Fireworks, their API data policies apply. OpenFlows itself does not send code to any third-party service. For maximum privacy, use a self-hosted LiteLLM proxy pointing to a local model - no data leaves your infrastructure.</p>,
  },
  {
    title: 'What happens when there are merge conflicts?',
    content: <p>VESSEL detects conflicts early via GitHub's <code>mergeable</code> field before CI even completes. It attempts automated resolution via GitHub's update-branch API or a local rebase. If it can't resolve automatically, it writes <code>CONFLICT_RESOLUTION.md</code> with context and re-routes the ticket back to the same FORGE worker - no new branch, no context loss. FORGE reworks the implementation and re-opens the PR.</p>,
  },
]

export default function Faq() {
  return (
    <DocsLayout breadcrumbs={[{ label: 'Docs', href: '/docs' }, { label: 'FAQ' }]}>
      <h1>Frequently Asked Questions</h1>
      <p>Common questions about OpenFlows answered. Can't find what you're looking for? <a href="https://github.com/The-AgenticFlow/AgentFlow/discussions" target="_blank" rel="noopener noreferrer">Ask on GitHub Discussions ↗</a></p>
      <Accordion items={FAQ_ITEMS} />
    </DocsLayout>
  )
}
