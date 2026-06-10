import { useState } from 'react'
import styles from './FlowDiagram.module.css'

const AGENTS = [
    {
        id: 'nexus',
        name: 'NEXUS',
        role: 'Orchestrator',
        description: 'Discovers issues, assigns work, supervises the pipeline, and recovers from failures.',
        icon: '◆',
        color: 'var(--color-accent)',
    },
    {
        id: 'forge',
        name: 'FORGE',
        role: 'Builder',
        description: 'Implements code in isolated worktrees, segment by segment, with automated testing.',
        icon: '⚡',
        color: 'var(--color-agent-nexus)',
    },
    {
        id: 'sentinel',
        name: 'SENTINEL',
        role: 'Reviewer',
        description: 'Ephemeral quality gatekeeper — reviews plans, evaluates segments, enforces standards.',
        icon: '🛡',
        color: '#d4a03c',
    },
    {
        id: 'vessel',
        name: 'VESSEL',
        role: 'DevOps',
        description: 'Monitors CI, detects merge conflicts early, resolves them, and squash-merges PRs.',
        icon: '🚀',
        color: '#5b8def',
    },
    {
        id: 'lore',
        name: 'LORE',
        role: 'Documenter',
        description: 'Generates ADRs, updates changelogs, and commits documentation after every merge.',
        icon: '📜',
        color: '#a78bfa',
    },
]

const FLOW_STEPS = [
    { from: 'nexus', to: 'forge', label: 'assigns ticket' },
    { from: 'forge', to: 'sentinel', label: 'submits plan' },
    { from: 'sentinel', to: 'forge', label: 'feedback loop' },
    { from: 'forge', to: 'vessel', label: 'opens PR' },
    { from: 'vessel', to: 'lore', label: 'merge event' },
    { from: 'lore', to: 'nexus', label: 'docs committed' },
]

const FAQ_ITEMS = [
    {
        question: 'What is OpenFlows?',
        answer: 'OpenFlows is an autonomous AI development team that runs itself 24/7 on your GitHub repo. Five specialized agents — NEXUS, FORGE, SENTINEL, VESSEL, and LORE — collaborate through a Redis-backed state machine to take GitHub issues all the way to merged, documented pull requests.',
    },
    {
        question: 'Do I need to write any code?',
        answer: 'No. You stay as the product owner — creating issues, setting priorities, and reviewing final results. The agents handle implementation, review, testing, merging, and documentation autonomously.',
    },
    {
        question: 'How does SENTINEL ensure code quality?',
        answer: 'SENTINEL is ephemeral — spawned fresh for each evaluation with no accumulated bias. It reviews FORGE\'s plan before any code is written, evaluates every segment after commit against 5 criteria, and performs a holistic final review before any PR is opened.',
    },
    {
        question: 'What happens when merge conflicts arise?',
        answer: 'VESSEL detects conflicts early via GitHub\'s mergeable field before CI completes. It attempts automated rebase and resolution, and if needed, routes the conflict back to FORGE through a rework loop — no new branches required.',
    },
    {
        question: 'Is OpenFlows open source?',
        answer: 'Yes. OpenFlows is fully open source under a permissive license. You can inspect the code, contribute, and self-host. The entire agent orchestration system is transparent and auditable.',
    },
    {
        question: 'How does the agent loop work?',
        answer: 'NEXUS discovers GitHub issues and assigns them to FORGE. FORGE writes a plan, which SENTINEL reviews. After approval, FORGE implements code segment by segment with SENTINEL evaluating each one. VESSEL handles CI and merging, then LORE documents everything. NEXUS picks the next ticket and the cycle repeats.',
    },
]

export default function FlowDiagram() {
    const [activeAgent, setActiveAgent] = useState(null)
    const [openFaq, setOpenFaq] = useState(null)

    return (
        <section className={styles.section} aria-labelledby="flow-title">
            {/* Flow Diagram */}
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>How it works</p>
                    <h2 id="flow-title" className={styles.title}>
                        Five agents. One loop. Zero manual work.
                    </h2>
                    <p className={styles.subtitle}>
                        Each agent has a specialized role in the pipeline. They communicate through a shared state machine,
                        hand off work automatically, and loop until every issue is merged and documented.
                    </p>
                </div>

                {/* Agent Cards */}
                <div className={styles.agentGrid}>
                    {AGENTS.map((agent) => (
                        <button
                            key={agent.id}
                            className={`${styles.agentCard} ${activeAgent === agent.id ? styles.agentCardActive : ''}`}
                            onClick={() => setActiveAgent(activeAgent === agent.id ? null : agent.id)}
                            style={{ '--agent-color': agent.color }}
                        >
                            <div className={styles.agentIcon}>{agent.icon}</div>
                            <div className={styles.agentInfo}>
                                <span className={styles.agentName}>{agent.name}</span>
                                <span className={styles.agentRole}>{agent.role}</span>
                            </div>
                            {activeAgent === agent.id && (
                                <p className={styles.agentDesc}>{agent.description}</p>
                            )}
                        </button>
                    ))}
                </div>

                {/* Flow Connection */}
                <div className={styles.flowPath}>
                    <div className={styles.flowLine}>
                        {FLOW_STEPS.map((step, i) => (
                            <div key={i} className={styles.flowStep}>
                                <span className={styles.flowFrom}>{step.from.toUpperCase()}</span>
                                <span className={styles.flowArrow}>→</span>
                                <span className={styles.flowTo}>{step.to.toUpperCase()}</span>
                                <span className={styles.flowLabel}>{step.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className={styles.cycleNote}>
                        <span className={styles.cycleIcon}>↻</span>
                        <span>The loop repeats — NEXUS picks the next ticket and the cycle starts again.</span>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className={styles.faqSection}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <p className={styles.eyebrow}>FAQ</p>
                        <h2 className={styles.title}>Frequently asked questions</h2>
                    </div>
                    <div className={styles.faqGrid}>
                        {FAQ_ITEMS.map((item, i) => (
                            <div
                                key={i}
                                className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ''}`}
                            >
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span>{item.question}</span>
                                    <span className={styles.faqToggle}>{openFaq === i ? '−' : '+'}</span>
                                </button>
                                {openFaq === i && (
                                    <p className={styles.faqAnswer}>{item.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}