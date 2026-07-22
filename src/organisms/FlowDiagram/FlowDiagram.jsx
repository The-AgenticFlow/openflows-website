import { useState, useRef, useCallback } from 'react'
import styles from './FlowDiagram.module.css'

export default function FlowDiagram() {
    const [scale, setScale] = useState(1)
    const [translate, setTranslate] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef({ x: 0, y: 0 })
    const translateStart = useRef({ x: 0, y: 0 })

    const handleZoomIn = useCallback(() => {
        setScale(s => Math.min(s + 0.25, 3))
    }, [])

    const handleZoomOut = useCallback(() => {
        setScale(s => {
            const next = Math.max(s - 0.25, 0.5)
            if (next <= 1) {
                setTranslate({ x: 0, y: 0 })
            }
            return next
        })
    }, [])

    const handleReset = useCallback(() => {
        setScale(1)
        setTranslate({ x: 0, y: 0 })
    }, [])

    // ── Mouse events ──
    const handleMouseDown = useCallback((e) => {
        if (scale <= 1) return
        setIsDragging(true)
        dragStart.current = { x: e.clientX, y: e.clientY }
        translateStart.current = { ...translate }
        e.preventDefault()
    }, [scale, translate])

    const handleMouseMove = useCallback((e) => {
        if (!isDragging) return
        const dx = e.clientX - dragStart.current.x
        const dy = e.clientY - dragStart.current.y
        setTranslate({
            x: translateStart.current.x + dx,
            y: translateStart.current.y + dy,
        })
    }, [isDragging])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    // ── Touch events ──
    const handleTouchStart = useCallback((e) => {
        if (scale <= 1) return
        if (e.touches.length === 1) {
            setIsDragging(true)
            const touch = e.touches[0]
            dragStart.current = { x: touch.clientX, y: touch.clientY }
            translateStart.current = { ...translate }
        }
    }, [scale, translate])

    const handleTouchMove = useCallback((e) => {
        if (!isDragging || e.touches.length !== 1) return
        e.preventDefault()
        const touch = e.touches[0]
        const dx = touch.clientX - dragStart.current.x
        const dy = touch.clientY - dragStart.current.y
        setTranslate({
            x: translateStart.current.x + dx,
            y: translateStart.current.y + dy,
        })
    }, [isDragging])

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false)
    }, [])

    // ── Wheel zoom ──
    const handleWheel = useCallback((e) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setScale(s => {
            const next = Math.min(Math.max(s + delta, 0.5), 3)
            if (next <= 1) setTranslate({ x: 0, y: 0 })
            return next
        })
    }, [])

    const canPan = scale > 1

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

                {/* SVG Flow Diagram with zoom */}
                <div className={styles.diagramWrap}>
                    {/* Zoom controls */}
                    <div className={styles.zoomControls}>
                        <button
                            className={styles.zoomBtn}
                            onClick={handleZoomIn}
                            aria-label="Zoom in"
                            title="Zoom in"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="7" cy="7" r="5" />
                                <line x1="7" y1="5" x2="7" y2="9" />
                                <line x1="5" y1="7" x2="9" y2="7" />
                                <line x1="11" y1="11" x2="14" y2="14" />
                            </svg>
                        </button>
                        <button
                            className={styles.zoomBtn}
                            onClick={handleZoomOut}
                            aria-label="Zoom out"
                            title="Zoom out"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <circle cx="7" cy="7" r="5" />
                                <line x1="5" y1="7" x2="9" y2="7" />
                                <line x1="11" y1="11" x2="14" y2="14" />
                            </svg>
                        </button>
                        <button
                            className={styles.zoomBtn}
                            onClick={handleReset}
                            aria-label="Reset zoom"
                            title="Reset zoom"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M3 3l10 10M13 3l-10 10" />
                            </svg>
                        </button>
                        <span className={styles.zoomLevel}>{Math.round(scale * 100)}%</span>
                    </div>

                    <div
                        className={styles.diagramViewport}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            cursor: isDragging ? 'grabbing' : canPan ? 'grab' : 'default',
                            touchAction: canPan ? 'none' : 'pan-y',
                        }}
                    >
                        <div
                            className={styles.diagramContent}
                            style={{
                                transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                                transformOrigin: 'center center',
                            }}
                        >
                            <svg
                                className={styles.diagramSvg}
                                viewBox="0 0 800 420"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Defs: arrow markers and gradients */}
                                <defs>
                                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-aubergine)" />
                                    </marker>
                                    <marker id="arrowhead-muted" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                        <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-graphite)" />
                                    </marker>
                                    <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="var(--color-bone)" />
                                        <stop offset="100%" stopColor="var(--color-fog)" />
                                    </linearGradient>
                                </defs>

                                {/* Connection lines with arrows */}
                                {/* NEXUS → FORGE: assigns ticket */}
                                <line x1="200" y1="100" x2="370" y2="100" stroke="var(--color-aubergine)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                <text x="285" y="88" textAnchor="middle" className={styles.flowLabelSvg}>assigns ticket</text>

                                {/* FORGE → SENTINEL: submits plan */}
                                <line x1="530" y1="100" x2="660" y2="100" stroke="var(--color-aubergine)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                <text x="595" y="88" textAnchor="middle" className={styles.flowLabelSvg}>submits plan</text>

                                {/* SENTINEL → FORGE: feedback loop (curved back) */}
                                <path d="M 700 140 Q 700 200 600 200 Q 500 200 460 140" stroke="var(--color-graphite)" strokeWidth="1.5" fill="none" strokeDasharray="6 3" markerEnd="url(#arrowhead-muted)" />
                                <text x="600" y="215" textAnchor="middle" className={styles.flowLabelSvgMuted}>feedback loop</text>

                                {/* FORGE → VESSEL: opens PR */}
                                <line x1="460" y1="140" x2="310" y2="300" stroke="var(--color-aubergine)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                <text x="405" y="215" textAnchor="middle" className={styles.flowLabelSvg}>opens PR</text>

                                {/* VESSEL → LORE: merge event */}
                                <line x1="370" y1="320" x2="530" y2="320" stroke="var(--color-aubergine)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                <text x="450" y="308" textAnchor="middle" className={styles.flowLabelSvg}>merge event</text>

                                {/* LORE → NEXUS: docs committed (curved back to start) */}
                                <path d="M 620 340 Q 700 400 400 400 Q 100 400 100 300 Q 100 200 130 140" stroke="var(--color-graphite)" strokeWidth="1.5" fill="none" strokeDasharray="6 3" markerEnd="url(#arrowhead-muted)" />
                                <text x="100" y="385" textAnchor="middle" className={styles.flowLabelSvgMuted}>docs committed  -  cycle repeats</text>

                                {/* Agent Nodes */}
                                {/* NEXUS */}
                                <rect x="60" y="60" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="var(--color-aubergine)" strokeWidth="2" />
                                <text x="130" y="95" textAnchor="middle" className={styles.nodeTitle}>NEXUS</text>
                                <text x="130" y="118" textAnchor="middle" className={styles.nodeRole}>Orchestrator</text>

                                {/* FORGE */}
                                <rect x="370" y="60" width="160" height="80" rx="12" fill="url(#nodeGrad)" stroke="var(--color-aubergine)" strokeWidth="2" />
                                <text x="450" y="95" textAnchor="middle" className={styles.nodeTitle}>FORGE</text>
                                <text x="450" y="118" textAnchor="middle" className={styles.nodeRole}>Builder</text>

                                {/* SENTINEL */}
                                <rect x="630" y="60" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="var(--color-agent-sentinel)" strokeWidth="2" />
                                <text x="700" y="95" textAnchor="middle" className={styles.nodeTitle}>SENTINEL</text>
                                <text x="700" y="118" textAnchor="middle" className={styles.nodeRole}>Reviewer</text>

                                {/* VESSEL */}
                                <rect x="170" y="280" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="var(--color-agent-vessel)" strokeWidth="2" />
                                <text x="240" y="315" textAnchor="middle" className={styles.nodeTitle}>VESSEL</text>
                                <text x="240" y="338" textAnchor="middle" className={styles.nodeRole}>DevOps</text>

                                {/* LORE */}
                                <rect x="530" y="280" width="140" height="80" rx="12" fill="url(#nodeGrad)" stroke="var(--color-agent-lore)" strokeWidth="2" />
                                <text x="600" y="315" textAnchor="middle" className={styles.nodeTitle}>LORE</text>
                                <text x="600" y="338" textAnchor="middle" className={styles.nodeRole}>Documenter</text>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}