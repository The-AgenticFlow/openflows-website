import { useState, useEffect, useRef } from 'react'
import styles from './TextToSpeechPlayer.module.css'

export default function TextToSpeechPlayer({ title, text }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const utteranceRef = useRef(null)

    useEffect(() => {
        if (!text) return

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
            setIsSpeaking(false)
            setIsPlaying(false)
        }
        utterance.onerror = () => {
            setIsSpeaking(false)
            setIsPlaying(false)
        }

        utteranceRef.current = utterance

        return () => {
            window.speechSynthesis.cancel()
        }
    }, [text])

    const handlePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.pause()
            setIsPlaying(false)
        } else {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume()
                setIsPlaying(true)
            } else {
                if (utteranceRef.current) {
                    window.speechSynthesis.speak(utteranceRef.current)
                    setIsPlaying(true)
                }
            }
        }
    }

    const handleStop = () => {
        window.speechSynthesis.cancel()
        setIsPlaying(false)
        setIsSpeaking(false)
    }

    if (!text) return null

    return (
        <div className={styles.ttsContainer}>
            <button
                className={styles.playBtn}
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                )}
            </button>

            {isSpeaking && (
                <div className={styles.visualizer}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`${styles.bar} ${styles.animating}`} />
                    ))}
                </div>
            )}

            <div className={styles.ttsInfo}>
                <span className={styles.ttsTitle}>Listen to this article</span>
                <span className={styles.ttsStatus}>
                    {isSpeaking ? 'Playing...' : isPlaying ? 'Paused' : 'Ready to play'}
                </span>
            </div>

            {(isPlaying || isSpeaking) && (
                <button
                    className={styles.playBtn}
                    onClick={handleStop}
                    aria-label="Stop"
                    style={{ marginLeft: '0.5rem' }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                </button>
            )}
        </div>
    )
}
