import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './TextToSpeechPlayer.module.css'

/** Strip markdown so TTS reads clean prose */
function stripMarkdown(md) {
    if (!md) return ''
    return md
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`[^`]+`/g, ' ')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')
        .replace(/_{1,3}([^_\n]+)_{1,3}/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^>\s*/gm, '')
        .replace(/^[-*_]{3,}\s*$/gm, '')
        .replace(/^[\s]*[-*+]\s+/gm, '')
        .replace(/^[\s]*\d+\.\s+/gm, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

/**
 * Split text into sentence-sized chunks (~200 chars max).
 * Chrome Linux speechSynthesis silently fails on long utterances.
 * Speaking short chunks sequentially is the reliable workaround.
 */
function chunkText(text, maxLen = 200) {
    const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text]
    const chunks = []
    let current = ''
    for (const s of sentences) {
        if ((current + s).length > maxLen && current.length > 0) {
            chunks.push(current.trim())
            current = s
        } else {
            current += s
        }
    }
    if (current.trim()) chunks.push(current.trim())
    return chunks
}

/** Wait for voices to be populated, up to `timeout` ms */
function waitForVoices(timeout = 3000) {
    return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) return resolve(voices)
        const onChanged = () => {
            const v = window.speechSynthesis.getVoices()
            if (v.length > 0) {
                window.speechSynthesis.removeEventListener('voiceschanged', onChanged)
                resolve(v)
            }
        }
        window.speechSynthesis.addEventListener('voiceschanged', onChanged)
        setTimeout(() => {
            window.speechSynthesis.removeEventListener('voiceschanged', onChanged)
            resolve(window.speechSynthesis.getVoices()) // may still be empty — that's ok
        }, timeout)
    })
}

export default function TextToSpeechPlayer({ title, text }) {
    const [status, setStatus] = useState('idle') // idle | playing | paused
    const stoppedRef = useRef(false)
    const pausedRef = useRef(false)
    const currentUtteranceRef = useRef(null)

    const cleanText = stripMarkdown(text)

    useEffect(() => {
        return () => {
            stoppedRef.current = true
            if ('speechSynthesis' in window) window.speechSynthesis.cancel()
        }
    }, [])

    const stopAll = useCallback(() => {
        stoppedRef.current = true
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
        currentUtteranceRef.current = null
        setStatus('idle')
    }, [])

    const speak = useCallback(async () => {
        if (!cleanText || !('speechSynthesis' in window)) return

        stoppedRef.current = false
        pausedRef.current = false

        // Cancel any previous speech
        window.speechSynthesis.cancel()
        await new Promise(r => setTimeout(r, 150)) // let engine reset

        const voices = await waitForVoices()

        // Log all available voices to console so we can see exact names
        console.log('[TTS] Available voices:', voices.map(v => `"${v.name}" | ${v.lang} | local:${v.localService}`))

        // Prefer a deep male English voice.
        // eSpeak exposes explicit male variants — higher numbers = deeper pitch.
        const MALE_PRIORITY = [
            /google uk english male/i,
            /english.*male7/i,
            /english.*male6/i,
            /english.*male5/i,
            /english.*male4/i,
            /english.*male3/i,
            /english.*male2/i,
            /english.*male1/i,
            /english.*male/i,
            /google us english/i,
            /\bmale\b/i,
            /david/i,
            /mark/i,
            /james/i,
            /daniel/i,
            /fred/i,
            /ralph/i,
        ]

        const enVoices = voices.filter(v => v.lang.startsWith('en'))
        let maleVoice = null
        for (const pattern of MALE_PRIORITY) {
            maleVoice = enVoices.find(v => pattern.test(v.name))
            if (maleVoice) break
        }
        maleVoice = maleVoice || enVoices.find(v => v.localService) || enVoices[0] || voices[0] || null

        console.log('[TTS] Selected voice:', maleVoice?.name, maleVoice?.lang)

        const chunks = chunkText(cleanText)
        setStatus('playing')

        // Speak chunks one at a time
        for (let i = 0; i < chunks.length; i++) {
            if (stoppedRef.current) break

            await new Promise((resolve, reject) => {
                const utterance = new SpeechSynthesisUtterance(chunks[i])
                utterance.rate = 0.88
                utterance.pitch = 0.6
                utterance.volume = 1
                if (maleVoice) utterance.voice = maleVoice

                currentUtteranceRef.current = utterance

                utterance.onend = () => resolve()
                utterance.onerror = (e) => {
                    if (e.error === 'interrupted' || e.error === 'canceled') resolve()
                    else reject(e)
                }

                // Safety timeout: if a chunk takes > 30s, skip it
                const safety = setTimeout(() => resolve(), 30000)
                utterance.onend = () => { clearTimeout(safety); resolve() }

                window.speechSynthesis.speak(utterance)
            }).catch(() => {})

            // Wait briefly between chunks to avoid Chrome queue bug
            if (!stoppedRef.current) {
                await new Promise(r => setTimeout(r, 50))
            }
        }

        if (!stoppedRef.current) {
            currentUtteranceRef.current = null
            setStatus('idle')
        }
    }, [cleanText])

    const handlePlayPause = () => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in your browser.')
            return
        }

        if (status === 'idle') {
            speak()
        } else if (status === 'playing') {
            window.speechSynthesis.pause()
            pausedRef.current = true
            setStatus('paused')
        } else if (status === 'paused') {
            window.speechSynthesis.resume()
            pausedRef.current = false
            setStatus('playing')
        }
    }

    if (!cleanText) return null

    const isActive = status === 'playing' || status === 'paused'
    const label = status === 'playing' ? 'Playing...' : status === 'paused' ? 'Paused' : 'Listen to this article'

    return (
        <div className={styles.ttsContainer}>
            <button
                className={styles.playBtn}
                onClick={handlePlayPause}
                aria-label={status === 'playing' ? 'Pause' : 'Play'}
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
