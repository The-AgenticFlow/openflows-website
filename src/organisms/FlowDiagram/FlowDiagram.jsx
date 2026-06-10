import styles from './FlowDiagram.module.css'

export default function FlowDiagram() {
    return (
        <section className={styles.section} aria-labelledby="flow-title">
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

                {/* SVG Flow Diagram */}
                <div className={styles.diagramWrap}>
                    <svg
                        className={styles.diagramSvg}
                        viewBox="0 0 800 420"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Defs: arrow markers and gradients */}
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-accent)" />
                            </marker>
                            <marker id="arrowhead-muted" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-text-muted)" />
                            </marker>
                            <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--color-surface)" />
                                <stop offset="100%" stopColor="var(--color-surface-2)" />
                            </linearGradient>
                        </defs>

                        {/* Connection lines with arrows */}
                        {/* NEXUS → FORGE: assigns ticket */}
                        <line x1="200" y1="100" x2="370" y2="100" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <text x="285" y="88" textAnchor="middle" className={styles.flowLabelSvg}>assigns ticket</text>

                        {/* FORGE → SENTINEL: submits plan */}
                        <line x1="530" y1="100" x2="660" y2="100" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <text x="595" y="88" textAnchor="middle" className={styles.flowLabelSvg}>submits plan</text>

                        {/* SENTINEL → FORGE: feedback loop (curved back) */}
                        <path d="M 700 140 Q 700 200 600 200 Q 500 200 460 140" stroke="var(--color-text-muted)" strokeWidth="1.5" fill="none" strokeDasharray="6 3" markerEnd="url(#arrowhead-muted)" />
                        <text x="600" y="215" textAnchor="middle" className={styles.flowLabelSvgMuted}>feedback loop</text>

                        {/* FORGE → VESSEL: opens PR */}
                        <line x1="460" y1="140" x2="310" y2="300" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <text x="405" y="215" textAnchor="middle" className={styles.flowLabelSvg}>opens PR</text>

                        {/* VESSEL → LORE: merge event */}
                        <line x1="370" y1="320" x2="530" y2="320" stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                        <text x="450" y="308" textAnchor="middle" className={styles.flowLabelSvg}>merge event</text>

                        {/* LORE → NEXUS: docs committed (curved back to start) */}
                        <path d="M 620 340 Q 700 400 400 400 Q 100 400 100 300 Q 100 200 130 140" stroke="var(--color-text-muted)" strokeWidth="1.5" fill="none" strokeDasharray="6 3" markerEnd="url(#arrowhead-muted)" />
                        <text x="100" y="385" textAnchor="middle" className={styles.flowLabelSvgMuted}>docs committed — cycle repeats</text>

                        {/* Agent Nodes */}
                        {/* NEXUS */}
                        <rect x="60" y="60" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="var(--color-accent)" strokeWidth="2" />
                        <text x="130" y="95" textAnchor="middle" className={styles.nodeTitle}>NEXUS</text>
                        <text x="130" y="118" textAnchor="middle" className={styles.nodeRole}>Orchestrator</text>

                        {/* FORGE */}
                        <rect x="370" y="60" width="160" height="80" rx="12" fill="url(#nodeGrad)" stroke="var(--color-accent)" strokeWidth="2" />
                        <text x="450" y="95" textAnchor="middle" className={styles.nodeTitle}>FORGE</text>
                        <text x="450" y="118" textAnchor="middle" className={styles.nodeRole}>Builder</text>

                        {/* SENTINEL */}
                        <rect x="630" y="60" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="#d4a03c" strokeWidth="2" />
                        <text x="700" y="95" textAnchor="middle" className={styles.nodeTitle}>SENTINEL</text>
                        <text x="700" y="118" textAnchor="middle" className={styles.nodeRole}>Reviewer</text>

                        {/* VESSEL */}
                        <rect x="170" y="280" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="#5b8def" strokeWidth="2" />
                        <text x="240" y="315" textAnchor="middle" className={styles.nodeTitle}>VESSEL</text>
                        <text x="240" y="338" textAnchor="middle" className={styles.nodeRole}>DevOps</text>

                        {/* LORE */}
                        <rect x="530" y="280" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="#a78bfa" strokeWidth="2" />
                        <text x="600" y="315" textAnchor="middle" className={styles.nodeTitle}>LORE</text>
                        <text x="600" y="338" textAnchor="middle" className={styles.nodeRole}>Documenter</text>
                    </svg>
                </div>
            </div>
        </section>
    )
}