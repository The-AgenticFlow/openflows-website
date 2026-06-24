import { useState, useRef, useCallback } from 'react'
import { supabase, isSupabaseConfigured, BLOG_IMAGES_BUCKET } from '@/lib/supabase'
import styles from './ImageUploader.module.css'

export default function ImageUploader({ currentUrl, onUpload, size = 'default', alt = 'Image' }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef(null)

    const handleFile = useCallback(async (file) => {
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file (JPEG, PNG, GIF, WebP, SVG)')
            return
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB')
            return
        }

        if (!isSupabaseConfigured() || !supabase) {
            setError('Supabase is not configured. Image upload is disabled.')
            return
        }

        setUploading(true)
        setError(null)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(BLOG_IMAGES_BUCKET)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(BLOG_IMAGES_BUCKET)
                .getPublicUrl(filePath)

            if (urlData?.publicUrl) {
                onUpload(urlData.publicUrl)
            }
        } catch (err) {
            console.error('Error uploading image:', err)
            setError(err.message || 'Failed to upload image')
        } finally {
            setUploading(false)
        }
    }, [onUpload])

    const handleFileInput = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(false)

        const file = e.dataTransfer?.files?.[0]
        if (file) {
            handleFile(file)
        }
    }, [handleFile])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOver(false)
    }, [])

    const handleRemove = () => {
        onUpload('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const isCompact = size === 'compact'
    const hasImage = currentUrl && currentUrl.trim() !== ''

    return (
        <div className={`${styles.uploader} ${isCompact ? styles.compact : ''}`}>
            {hasImage ? (
                <div className={styles.preview}>
                    <img src={currentUrl} alt={alt} />
                    <div className={styles.previewActions}>
                        <button
                            type="button"
                            className={styles.replaceBtn}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={handleRemove}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : uploading ? (
                <div className={styles.uploading}>
                    <div className={styles.spinner} />
                    <span>Uploading...</span>
                </div>
            ) : (
                <div
                    className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className={styles.dropText}>
                        <span>Click to upload</span> or drag and drop
                    </p>
                    <p className={styles.hint}>PNG, JPG, GIF, WebP, SVG (max 10MB)</p>
                </div>
            )}

            {error && (
                <div className={styles.error}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9v4M9 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className={styles.hiddenInput}
            />
        </div>
    )
}
