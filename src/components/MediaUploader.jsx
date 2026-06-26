import { useState, useRef, useCallback } from 'react'
import { supabase, isSupabaseConfigured, BLOG_IMAGES_BUCKET, BLOG_VIDEOS_BUCKET } from '@/lib/supabase'
import styles from './MediaUploader.module.css'

export default function MediaUploader({ type = 'image', onUpload }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')
    const fileInputRef = useRef(null)

    const bucket = type === 'video' ? BLOG_VIDEOS_BUCKET : BLOG_IMAGES_BUCKET
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for image
    const acceptType = type === 'video' ? 'video/*' : 'image/*'
    const hint = type === 'video'
        ? 'MP4, WebM, OGG (max 100MB)'
        : 'PNG, JPG, GIF, WebP, SVG (max 10MB)'

    const handleFile = useCallback(async (file) => {
        if (!file) return

        // Validate file type
        const expectedPrefix = type === 'video' ? 'video/' : 'image/'
        if (!file.type.startsWith(expectedPrefix)) {
            setError(`Please upload a ${type} file`)
            return
        }

        // Validate file size
        if (file.size > maxSize) {
            const sizeMB = maxSize / (1024 * 1024)
            setError(`File size must be less than ${sizeMB}MB`)
            return
        }

        if (!isSupabaseConfigured() || !supabase) {
            setError('Supabase is not configured. Media upload is disabled.')
            return
        }

        setUploading(true)
        setError(null)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            if (urlData?.publicUrl) {
                // Create local preview
                const localPreview = URL.createObjectURL(file)
                setPreviewUrl(localPreview)
                onUpload(urlData.publicUrl, type)
            }
        } catch (err) {
            console.error(`Error uploading ${type}:`, err)
            setError(err.message || `Failed to upload ${type}`)
        } finally {
            setUploading(false)
        }
    }, [type, bucket, maxSize, onUpload])

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
        onUpload('', type)
        setPreviewUrl('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const hasPreview = previewUrl && previewUrl.trim() !== ''

    return (
        <div className={styles.uploader}>
            {hasPreview ? (
                <div className={styles.preview}>
                    {type === 'video' ? (
                        <div className={styles.videoPreview}>
                            <video className={styles.video} controls src={previewUrl} />
                        </div>
                    ) : (
                        <img className={styles.image} src={previewUrl} alt="Media preview" />
                    )}
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
                        {type === 'video' ? (
                            <>
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </>
                        ) : (
                            <>
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </>
                        )}
                    </svg>
                    <p className={styles.dropText}>
                        <span>Click to upload</span> or drag and drop
                    </p>
                    <p className={styles.hint}>{hint}</p>
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
                accept={acceptType}
                onChange={handleFileInput}
                className={styles.fileInput}
            />
        </div>
    )
}
