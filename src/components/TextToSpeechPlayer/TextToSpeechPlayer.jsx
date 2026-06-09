import React, { useState, useEffect, useRef } from 'react';
import styles from './TextToSpeechPlayer.module.css';

const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
    </svg>
);

const PauseIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
);

const cleanMarkdown = (mdText) => {
    if (!mdText) return '';
    return mdText
        .replace(/#+\s+/g, '') // Remove headers
        .replace(/[*_]{1,2}(.*?)[*_]{1,2}/g, '$1') // Remove bold/italic
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Links -> text only
        .replace(/`([^`]+)`/g, '$1') // Inline code
        .replace(/```[\s\S]*?```/g, 'Code block omitted.') // Block code
        .replace(/>\s+/g, '') // Blockquotes
        .replace(/-{3,}/g, '') // HRs
        .replace(/!\[(.*?)\]\((.*?)\)/g, '') // Remove image alt text completely
        .trim();
};

export function TextToSpeechPlayer({ title, text }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [listeningTime, setListeningTime] = useState(0);

    // Core state for chunked playback
    const chunksRef = useRef([]);
    const currentChunkIndexRef = useRef(0);
    const activeUtteranceRef = useRef(null);
    const stopRequestedRef = useRef(false);

    useEffect(() => {
        if (text) {
            const wordCount = text.split(/\s+/).length;
            const minutes = Math.ceil(wordCount / 150);
            setListeningTime(minutes);
        }
    }, [text]);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setIsSupported(true);
            window.speechSynthesis.getVoices();
        }
        return () => {
            stopSpeech();
        };
    }, []);

    const stopSpeech = () => {
        stopRequestedRef.current = true;
        window.speechSynthesis.cancel();
        activeUtteranceRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
    };

    const playNextChunk = () => {
        if (stopRequestedRef.current) return;

        const index = currentChunkIndexRef.current;
        if (index >= chunksRef.current.length) {
            // Finished all chunks
            setIsPlaying(false);
            setIsPaused(false);
            return;
        }

        const chunkText = chunksRef.current[index];
        if (!chunkText || chunkText.trim().length === 0) {
            currentChunkIndexRef.current++;
            playNextChunk();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(chunkText);
        activeUtteranceRef.current = utterance; // Protect from GC

        // Voice selection - prefer male voices
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            // Known male voice identifiers across platforms
            const maleVoiceNames = [
                'Daniel', 'Alex', 'Tom', 'Fred', 'Junior', 'Ralph',
                'Bruce', 'Victor', 'Albert', 'David', 'Mark', 'James',
                'Google UK English Male', 'Microsoft David', 'Microsoft Mark',
                'Microsoft Richard', 'Microsoft George',
            ];

            // Known female voice names to explicitly avoid
            const femaleVoiceNames = [
                'Samantha', 'Victoria', 'Karen', 'Moira', 'Tessa', 'Fiona',
                'Kate', 'Zuzana', 'Ellen', 'Allison', 'Ava', 'Joana', 'Paulina',
                'Monica', 'Alice', 'Google UK English Female', 'Microsoft Zira',
                'Microsoft Hazel', 'Microsoft Susan', 'Microsoft Linda',
                'Microsoft Heather', 'Microsoft Catherine',
            ];

            const preferredVoice = voices.find(v =>
                v.lang.startsWith('en') && maleVoiceNames.some(m => v.name.includes(m))
            ) || voices.find(v =>
                v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
            ) || voices.find(v =>
                v.lang.startsWith('en') && !femaleVoiceNames.some(f => v.name.includes(f))
            ) || voices.find(v => v.lang.startsWith('en'));
            if (preferredVoice) utterance.voice = preferredVoice;
        }

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            if (stopRequestedRef.current) return;
            currentChunkIndexRef.current++;
            // Small delay between chunks for a natural feel and to avoid queue issues
            setTimeout(playNextChunk, 50);
        };

        utterance.onerror = (e) => {
            console.error('TTS Chunk Error:', e.error, '| Text:', chunkText);
            // If interrupted, we usually want to stop or retry. 
            // In most cases, interrupted means someone called cancel().
            if (e.error !== 'interrupted') {
                setIsPlaying(false);
                setIsPaused(false);
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    const startSpeech = () => {
        stopRequestedRef.current = false;
        const cleanedText = cleanMarkdown(text);
        const titleAnnouncement = title ? `Article title: ${title}. ` : '';
        const fullText = titleAnnouncement + cleanedText;

        // Split text into small chunks of ~150 chars, but break at sentences
        // This is the most resilient way to handle Chrome's TTS bugs
        const regex = /.{1,160}(?:\.|\?|!|\s|$)/g;
        const chunkMatches = fullText.match(regex) || [fullText];

        chunksRef.current = chunkMatches.map(c => c.trim()).filter(c => c.length > 0);
        currentChunkIndexRef.current = 0;

        window.speechSynthesis.cancel();
        // Give the OS a moment to clear its buffers
        setTimeout(() => {
            playNextChunk();
        }, 150);
    };

    const handleToggle = () => {
        if (!isSupported) return;

        // Force resume for Chrome bugs
        window.speechSynthesis.resume();

        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
            setIsPaused(true);
        } else if (isPaused) {
            window.speechSynthesis.resume();
            setIsPlaying(true);
            setIsPaused(false);
        } else {
            startSpeech();
        }
    };

    if (!isSupported) return null;

    return (
        <div className={styles.ttsContainer}>
            <button
                onClick={handleToggle}
                className={styles.playBtn}
                title={isPlaying ? "Pause" : "Listen"}
            >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className={styles.ttsInfo}>
                <span className={styles.ttsTitle}>Listen to Article</span>
                <span className={styles.ttsStatus}>
                    {isPlaying ? 'Speaking...' : isPaused ? 'Paused' : `${listeningTime} min listen • Browser AI`}
                </span>
            </div>

            <div className={styles.visualizer}>
                <div className={`${styles.bar} ${isPlaying ? styles.animating : ''}`} style={{ height: isPlaying ? '100%' : '4px' }}></div>
                <div className={`${styles.bar} ${isPlaying ? styles.animating : ''}`} style={{ height: isPlaying ? '60%' : '4px' }}></div>
                <div className={`${styles.bar} ${isPlaying ? styles.animating : ''}`} style={{ height: isPlaying ? '80%' : '4px' }}></div>
                <div className={`${styles.bar} ${isPlaying ? styles.animating : ''}`} style={{ height: isPlaying ? '40%' : '4px' }}></div>
                <div className={`${styles.bar} ${isPlaying ? styles.animating : ''}`} style={{ height: isPlaying ? '90%' : '4px' }}></div>
            </div>
        </div>
    );
}

export default TextToSpeechPlayer;
