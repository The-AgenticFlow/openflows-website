import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './TextToSpeechPlayer.module.css'

/** Strip markdown so TTS reads clean prose, not raw syntax */
function stripMarkdown(md) {
    if (!md) return ''
    return md
        .replace(/```[\s\S]*?```/g, ' ')   // fenced code blocks
        .replace(/`[^`]+`/g, ' ')           // inline code
        .replace(/^#{1,6}\s+/gm, '')        // heading markers
        .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1') // bold/italic
        .replace(/_{1,3}([^_\n]+)_{1,3}/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text only
        .replace(/^>\s*/gm, '')             // blockquotes
        .replace(/^[-*_]{3,}\s*$/gm, '')    // hr
        .replace(/^[\s]*[-*+]\s+/gm, '')    // unordered list markers
        .replace(/^[\s]*\d+\.\s+/gm, '')    // ordered list markers
        .replace(/<[^>]+>/g, '')            // HTML tags
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

export default function TextToSpeechPlayer({ title, text }) {
    const [status, setStatus] = useState('idle') // idle | loading | playing | paused
    const [voicesReady, setVoicesReady] = useState(false)
    const keepAliveRef = useRef(null)
    const utteranceRef = useRef(null)

    const cleanText = stripMarkdown(text)

    // Load voices — Chrome fires voiceschanged asynchronously
    useEffect(() => {
        if (!('speechSynthesis' in window)) return

        const checkVoices = () => {
            const voices = window.speechSynthesis.getVoices()
            if (voices.length > 0) {
                setVoicesReady(true)
            }
        }

        checkVoices()
        window.speechSynthesis.addEventListener('voiceschanged', checkVoices)

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', checkVoices)
            window.speechSynthesis.cancel()
            clearInterval(keepAliveRef.current)
        }
    }, [])

    const stopAll = useCallback(() => {
        clearInterval(keepAliveRef.current)
        window.speechSynthesis.cancel()
        utteranceRef.current = null
        setStatus('idle')
    }, [])

    const speak = useCallback(() => {
        if (!cleanText) return

        // Cancel anything currently speaking
        clearInterval(keepAliveRef.current)
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(cleanText)
        utterance.rate = 0.92
        utterance.pitch = 1
        utterance.volume = 1

        // Pick a voice — prefer an English one if available
        const voices = window.speechSynthesis.getVoices()
        const enVoice = voices.find(v => v.lang.startsWith('en-') && !v.name.includes('Google') && v.localService)
            || voices.find(v => v.lang.startsWith('en-'))
            || voices[0]
        if (enVoice) utterance.voice = enVoice

        utterance.onstart = () => setStatus('playing')

        utterance.onend = () => {
            clearInterval(keepAliveRef.current)
            utteranceRef.current = null
            setStatus('idle')
        }

        utterance.onerror = (e) => {
            if (e.error === 'interrupted' || e.error === 'canceled') return
            clearInterval(keepAliveRef.current)
            utteranceRef.current = null
            setStatus('idle')
        }

        utteranceRef.current = utterance

        // Chrome bug: speechSynthesis silently stops after ~15s on long text.
        // Workaround: pause+resume every 12 seconds to keep it alive.
        keepAliveRef.current = setInterval(() => {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                window.speechSynthesis.pause()
                window.speechSynthesis.resume()
            }
        }, 12000)

        setStatus('loading')
        window.speechSynthesis.speak(utterance)
    }, [cleanText])

    const handlePlayPause = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in your browser.')
            return
        }

        if (status === 'idle' || status === 'loading') {
            speak()
        } else if (status === 'playing') {
            window.speechSynthesis.pause()
            setStatus('paused')
        } else if (status === 'paused') {
            window.speechSynthesis.resume()
            setStatus('playing')
        }
    }

    if (!cleanText) return null

    const isActive = status === 'playing' || status === 'paused' || status === 'loading'
    const label = status === 'playing' ? 'Playing...' : status === 'paused' ? 'Paused' : status === 'loading' ? 'Loading...' : 'Listen to this article'

    return (
        <div className={styles.ttsContainer}>
            <button
                className={styles.playBtn}
                onClick={handlePlayPause}
                aria-label={status === 'playing' ? 'Pause' : 'Play'}
                disabled={!voicesReady}
                title={!voicesReady ? 'Loading voices...' : undefined}
            >
                {status === 'playing' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                )}
            </button>

            {status === 'playing' && (
                <div className={styles.visualizer}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`${styles.bar} ${styles.animating}`} />
                    ))}
                </div>
            )}

            <div className={styles.ttsInfo}>
                <span className={styles.ttsTitle}>Listen to this article</span>
                <span className={styles.ttsStatus}>{label}</span>
            </div>

            {isActive && (
                <button
                    className={styles.stopBtn}
                    onClick={stopAll}
                    aria-label="Stop"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                </button>
            )}
        </div>
    )
}
