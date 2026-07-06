import Layout from '@/organisms/Layout/Layout'
import { CodeBlock, Callout } from '@/molecules/DocComponents/DocComponents'
import styles from '../pages/demos/Demos.module.css'

const STEPS = [
  {
    title: 'Create GitHub Issue',
    desc: 'A team member creates a GitHub issue describing a bug or feature request.',
    code: { lang: 'markdown', content: `## Bug: Pagination returns wrong results for page 2+

**Labels:** bug, priority:high

The API endpoint \`GET /api/v1/items\` returns duplicate
items when requesting page 2 or higher. The offset
calculation appears to be off by one.

Expected: \`offset = (page - 1) * per_page\`
Actual:   \`offset = page * per_page\`` },
  },
  {
    title: 'NEXUS Assigns the Ticket',
    desc: 'NEXUS discovers the issue on the next poll cycle, creates a typed ticket, and assigns it to an idle FORGE worker.',
    code: { lang: 'json', content: `{
  "ticket_id": "T-142",
  "issue_number": 142,
  "status": "assigned",
  "worker": "forge-1",
  "branch": "forge-1/T-142"
}` },
  },
  {
    title: 'FORGE Writes PLAN.md',
    desc: 'FORGE creates an isolated Git worktree, reads the codebase, and writes a segment-by-segment implementation plan.',
    code: { lang: 'markdown', content: `# PLAN - T-142: Fix pagination offset

## Segment 1: Fix calculate_offset in src/api/pagination.rs
Change: page * per_page → page.saturating_sub(1) * per_page

## Segment 2: Add unit tests
Add 3 test cases: page 1, page 2, large page number` },
  },
  {
    title: 'SENTINEL Reviews the Plan',
    desc: 'SENTINEL reads PLAN.md and writes CONTRACT.md before a single line of code is written.',
    code: { lang: 'markdown', content: `# CONTRACT - T-142
status: AGREED

## Acceptance Criteria
1. ✅ Fix offset calculation to (page - 1) * per_page
2. ✅ Add unit tests for boundary cases (page 1, page 2, large page)
3. ✅ No regression on existing pagination behaviour` },
  },
  {
    title: 'FORGE Implements & SENTINEL Evaluates',
    desc: 'FORGE implements each segment and commits. After each commit, SENTINEL writes a segment eval.',
    code: { lang: 'rust', content: `// Fixed code in src/api/pagination.rs
fn calculate_offset(page: u32, per_page: u32) -> u32 {
    page.saturating_sub(1) * per_page
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn test_first_page()  { assert_eq!(calculate_offset(1, 20), 0);    }
    #[test] fn test_second_page() { assert_eq!(calculate_offset(2, 20), 20);   }
    #[test] fn test_large_page()  { assert_eq!(calculate_offset(100, 50), 4950); }
}` },
  },
  {
    title: 'SENTINEL Final Review → PR Opened',
    desc: 'SENTINEL writes final-review.md. APPROVED unblocks FORGE to open the pull request via GitHub MCP.',
    code: { lang: 'json', content: `{
  "verdict": "APPROVED",
  "checks": {
    "correctness":  { "pass": true, "notes": "Off-by-one fix is accurate" },
    "security":     { "pass": true, "notes": "No concerns" },
    "test_coverage":{ "pass": true, "notes": "3 test cases cover edge cases" },
    "standards":    { "pass": true, "notes": "saturating_sub is idiomatic Rust" },
    "regressions":  { "pass": true, "notes": "Page 1 behaviour unchanged" }
  }
}` },
  },
  {
    title: 'VESSEL Merges, LORE Documents',
    desc: 'VESSEL polls CI at 10s intervals. When green, it squash-merges the PR. LORE then writes the ADR and updates CHANGELOG.md.',
    code: { lang: 'bash', content: `INFO  vessel: CI success ✓ - squash-merging PR #143
INFO  lore: ADR-012 written → docs/adr/2026-06-01-fix-pagination-offset.md
INFO  lore: CHANGELOG.md updated → committed to main
INFO  nexus: T-142 merged. Picking next ticket.` },
  },
]

export default function Walkthrough() {
  return (
    <Layout>
      <div className={styles.walkthroughPage}>
        <p className={styles.eyebrow}>Demos</p>
        <h1 className={styles.title}>Step-by-Step Walkthrough</h1>
        <p style={{ color: 'var(--color-graphite)', marginBottom: '2rem', lineHeight: 1.7 }}>
          Follow a complete OpenFlows pipeline from GitHub issue to merged, documented PR. Each step shows what happens, which agent acts, and what files are created.
        </p>

        <div className="walkthroughSteps">
          {STEPS.map(({ title, desc, code }) => (
            <div key={title} className="walkthroughStep">
              <p className="walkthroughTitle">{title}</p>
              <p className="walkthroughDesc">{desc}</p>
              {code && <CodeBlock lang={code.lang}>{code.content}</CodeBlock>}
            </div>
          ))}
        </div>

        <Callout type="tip" title="Try it yourself">
          Ready to run this on your own repo? Follow the <a href="/docs/getting-started">Getting Started guide</a> - you'll be up and running in under 5 minutes.
        </Callout>
      </div>
    </Layout>
  )
}
