import { useState, useRef } from 'react'
import { supabase, isSupabaseConfigured, BLOG_IMAGES_BUCKET, BLOG_VIDEOS_BUCKET } from '@/lib/supabase'
import styles from './MediaUploader.module.css'

export default function MediaUploader({
    currentUrl,
    onUpload,
    type = 'image', // 'image' | 'video' | 'both'
    size = 'default',
    alt = 'Media preview'
}) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const [mediaError, setMediaError] = useState(false)
    const [mediaType, setMediaType] = useState(null) // 'image' | 'video'
    const fileInputRef = useRef(null)

    const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

    const getAllowedTypes = () => {
        if (type === 'image') return IMAGE_TYPES
        if (type === 'video') return VIDEO_TYPES
        return [...IMAGE_TYPES, ...VIDEO_TYPES]
    }

    const getMediaTypeFromFile = (file) => {
        if (IMAGE_TYPES.includes(file.type)) return 'image'
        if (VIDEO_TYPES.includes(file.type)) return 'video'
        return null
    }

    const getBucketForType = (mediaType) => {
        return mediaType === 'video' ? BLOG_VIDEOS_BUCKET : BLOG_IMAGES_BUCKET
    }

    const handleFileSelect = async (file) => {
        if (!isSupabaseConfigured() || !supabase) {
            setError('Supabase is not configured')
            return
        }

        const allowedTypes = getAllowedTypes()
        if (!allowedTypes.includes(file.type)) {
            const typeLabel = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'images or videos'
            setError(`Invalid file type. Please upload ${typeLabel} (JPEG, PNG, GIF, WebP${type !== 'image' ? ', MP4, WebM' : ''}).`)
            return
        }

        const detectedType = getMediaTypeFromFile(file)
        const maxSize = detectedType === 'video' ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE

        if (file.size > maxSize) {
            const maxSizeMB = maxSize / (1024 * 1024)
            setError(`File is too large. Maximum size is ${maxSizeMB}MB.`)
            return
        }

        setUploading(true)
        setError(null)
        setMediaError(false)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const folder = detectedType === 'video' ? 'blog-videos' : 'blog-images'
            const filePath = `${folder}/${fileName}`

            const bucket = getBucketForType(detectedType)

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
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

            setMediaType(detectedType)
            onUpload(urlData.publicUrl, detectedType)
        } catch (err) {
            console.error('Error uploading media:', err)
            setError(err.message || 'Failed to upload media')
        } finally {
            setUploading(false)
        }
    }

    const handleInputChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)

        const file = e.dataTransfer.files?.[0]
        if (file) {
            handleFileSelect(file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragOver(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setDragOver(false)
    }

    const handleRemove = () => {
        onUpload('', null)
        setMediaError(false)
        setMediaType(null)
    }

    const detectMediaTypeFromUrl = (url) => {
        if (!url) return null
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov']
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']

        const lowerUrl = url.toLowerCase()
        if (videoExtensions.some(ext => lowerUrl.includes(ext))) return 'video'
        if (imageExtensions.some(ext => lowerUrl.includes(ext))) return 'image'
        return null
    }

    const currentMediaType = mediaType || detectMediaTypeFromUrl(currentUrl)

    const renderPreview = () => {
        if (!currentUrl) return null

        if (currentMediaType === 'video') {
            return (
                <div className={styles.videoPreview}>
                    <video
                        src={currentUrl}
                        controls
                        className={styles.video}
                        onError={() => setMediaError(true)}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            )
        }

        return (
            <img
                src={currentUrl}
                alt={alt}
                onError={() => setMediaError(true)}
                className={styles.image}
            />
        )
    }

    const getAcceptString = () => {
        if (type === 'image') return 'image/*'
        if (type === 'video') return 'video/*'
        return 'image/*,video/*'
    }

    const getDropzoneText = () => {
        if (type === 'image') return { primary: 'Drop image here', secondary: 'or click to browse' }
        if (type === 'video') return { primary: 'Drop video here', secondary: 'or click to browse' }
        return { primary: 'Drop image or video here', secondary: 'or click to browse' }
    }

    const dropzoneText = getDropzoneText()

    return (
        <div className={`${styles.uploader} ${size === 'compact' ? styles.compact : ''}`}>
            {currentUrl ? (
                <div
                    className={styles.preview}
                    onClick={() => size === 'compact' && fileInputRef.current?.click()}
                >
                    {mediaError ? (
                        <div className={styles.fallbackIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                    ) : (
                        renderPreview()
                    )}
                    <div className={styles.previewActions}>
                        <button
                            type="button"
                            className={styles.replaceBtn}
                            onClick={(e) => {
                                e.stopPropagation()
                                fileInputRef.current?.click()
                            }}
                        >
                            Replace
                        </button>
                        <button
                            type="button"
                            className={styles.removeBtn}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleRemove()
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {uploading ? (
                        <div className={styles.uploading}>
                            <div className={styles.spinner} />
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <p className={styles.dropText}>
                                <span>{dropzoneText.primary}</span>
                                <br />
                                {dropzoneText.secondary}
                            </p>
                            <p className={styles.hint}>
                                {type === 'image' && 'JPEG, PNG, GIF, WebP, SVG (max 10MB)'}
                                {type === 'video' && 'MP4, WebM, OGG (max 100MB)'}
                                {type === 'both' && 'Images: max 10MB • Videos: max 100MB'}
                            </p>
                        </>
                    )}
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept={getAcceptString()}
                onChange={handleInputChange}
                className={styles.fileInput}
            />

            {error && (
                <div className={styles.error}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9v4M9 13h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}