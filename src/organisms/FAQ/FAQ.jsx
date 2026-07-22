import { useState } from 'react'
import styles from './FAQ.module.css'

const FAQ_ITEMS = [
    {
        question: 'What is OpenFlows?',
        answer: 'OpenFlows is the orchestration layer that sits on top of your Coder environment. Five specialized agents - NEXUS, FORGE, SENTINEL, VESSEL, and LORE - collaborate through a Redis-backed state machine to take GitHub issues all the way to merged, documented pull requests. Coder governs where agents run; OpenFlows governs how they coordinate.',
    },
    {
        question: 'How does OpenFlows relate to Coder?',
        answer: 'Coder is the infrastructure layer - it manages your development environments, workspaces, and compute. OpenFlows is the application layer - it orchestrates AI agents on top of Coder so your engineering team can focus on architecture instead of implementation. Together they give you a safe, secure, auditable, and governed SDLC.',
    },
    {
        question: 'Do I need to write any code?',
        answer: 'No. Your team stays focused on architecture - creating issues, setting priorities, and reviewing specs. The agentic dev team handles implementation, review, testing, merging, and documentation autonomously within your governed Coder environment.',
    },
    {
        question: 'How does SENTINEL ensure code quality?',
        answer: "SENTINEL is ephemeral - spawned fresh for each evaluation with no accumulated bias. It reviews FORGE's plan before any code is written, evaluates every segment after commit against 5 criteria, and performs a holistic final review before any PR is opened. Every review is logged and auditable.",
    },
    {
        question: 'What happens when merge conflicts arise?',
        answer: "VESSEL detects conflicts early via GitHub's mergeable field before CI completes. It attempts automated rebase and resolution, and if needed, routes the conflict back to FORGE through a rework loop - no new branches required.",
    },
    {
        question: 'Is OpenFlows open source?',
        answer: 'Yes. OpenFlows is fully open source. You can inspect the code, contribute, and self-host on your own Coder environment. The entire agent orchestration system is transparent and auditable.',
    },
    {
        question: 'How does the agent loop work?',
        answer: 'NEXUS discovers GitHub issues and assigns them to FORGE. FORGE writes a plan, which SENTINEL reviews. After approval, FORGE implements code segment by segment with SENTINEL evaluating each one. VESSEL handles CI and merging, then LORE documents everything. NEXUS picks the next ticket and the cycle repeats - all coordinated, governed, and auditable from end to end.',
    },
]

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState(null)

    return (
        <section className={styles.section} aria-labelledby="faq-title">
            <div className={styles.container}>
                <div className={styles.header}>
                    <p className={styles.eyebrow}>FAQ</p>
                    <h2 id="faq-title" className={styles.title}>Frequently asked questions</h2>
                </div>
                <div className={styles.faqGrid}>
                    {FAQ_ITEMS.map((item, i) => {
                        const isOpen = openFaq === i
                        return (
                            <div
                                key={i}
                                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
                            >
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{item.question}</span>
                                    <svg 
                                        className={`${styles.faqToggle} ${isOpen ? styles.faqToggleOpen : ''}`}
                                        width="20" 
                                        height="20" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    >
                                        {isOpen ? (
                                            <path d="M5 12h14" />
                                        ) : (
                                            <>
                                                <path d="M12 5v14" />
                                                <path d="M5 12h14" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                                <div className={`${styles.faqAnswer} ${isOpen ? styles.faqAnswerOpen : ''}`}>
                                    <p className={styles.faqText}>{item.answer}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}