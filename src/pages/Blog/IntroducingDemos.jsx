import Layout from '@/organisms/Layout/Layout'
import styles from './Blog.module.css'

export default function IntroducingDemos() {
  return (
    <Layout>
      <article className={styles.article}>
        <p className={styles.eyebrow}>Blog</p>
        <h1 className={styles.title}>Introducing the Developer Documentation Hub</h1>
        <div className={styles.articleMeta}>
          <span>May 26, 2026</span>
          <span className={styles.tag}>Announcement</span>
          <span className={styles.tag}>Documentation</span>
        </div>
        <div className={styles.articleBody}>
          <p>OpenFlows has always been about making autonomous software development accessible. When we launched the project, we started with a single-page landing site that explained the concept — an AI-powered team of agents that discovers issues, writes code, reviews it, and merges pull requests without human intervention. It was a compelling pitch, but we heard the same question over and over: "How does it actually work?"</p>
          <p>That's why we built the Developer Documentation Hub.</p>
          <p>Documentation is more than reference material. It's the on-ramp to adoption. A developer visiting openflows.dev for the first time needs to understand not just what the product does, but how it fits into their daily workflow. They need to see it in action, configure it for their stack, and trust that it will handle their codebase responsibly. The new hub addresses each of these needs with focused, practical content.</p>
          <p>The Documentation section covers everything from installation and quick start to deep architectural explanations of how NEXUS, FORGE, SENTINEL, LORE, and VESSEL interact. We've written installation guides for all platforms, with platform-specific gotchas called out in warning boxes. The agent setup guide walks through every configuration option in <code>registry.json</code>, with real examples for model selection, worker scaling, and per-agent GitHub tokens.</p>
          <p>The API Reference provides a complete endpoint listing with curl examples and response schemas. Whether you want to list active agents, create tasks programmatically, or trigger workflows from your own tooling, the endpoints you need are documented. We've also built an interactive API Explorer where you can test endpoints directly in the browser with mock responses — no setup required.</p>
          <p>Interactive Demos bring the experience to life. The terminal simulation shows a real-time animation of a complete OpenFlows session: issue discovery, code implementation, code review, and PR merge. The step-by-step walkthrough breaks down each phase of the workflow with the actual code involved — from the GitHub issue to the Rust fix to the SENTINEL review JSON.</p>
          <p>Use Cases demonstrate real-world impact with before/after comparisons. We've documented how web development teams use OpenFlows to cut bug resolution time from days to hours, and how DevOps teams handle merge conflicts and CI/CD automation without manual intervention.</p>
          <p>This is just the beginning. We're planning to add video walkthroughs, community-contributed use case templates, and integration guides for more tools. If there's something you'd like to see covered, open an issue on GitHub.</p>
          <p>Welcome to the OpenFlows Documentation Hub. Your autonomous development team is ready when you are.</p>
        </div>
      </article>
    </Layout>
  )
}
