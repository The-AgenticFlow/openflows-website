import { useState, useRef } from 'react'
import { supabase, isSupabaseConfigured, BLOG_IMAGES_BUCKET } from '@/lib/supabase'
import styles from './ImageUploader.module.css'

export default function ImageUploader({ currentUrl, onUpload }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef(null)

    const handleFileSelect = async (file) => {
        if (!isSupabaseConfigured() || !supabase) {
            setError('Supabase is not configured')
            return
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            setError('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.')
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            setError('File is too large. Maximum size is 5MB.')
            return
        }

        setUploading(true)
        setError(null)

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `blog-images/${fileName}`

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
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

            onUpload(urlData.publicUrl)
        } catch (err) {
            console.error('Error uploading image:', err)
            setError(err.message || 'Failed to upload image')
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
        onUpload('')
    }

    return (
        <div className={styles.uploader}>
            {currentUrl ? (
                <div className={styles.preview}>
                    <img src={currentUrl} alt="Cover preview" />
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
                            <p>Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <p className={styles.dropText}>
                                <span>Click to upload</span> or drag and drop
                            </p>
                            <p className={styles.hint}>PNG, JPG, GIF, or WebP (max 5MB)</p>
                        </>
                    )}
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
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleInputChange}
                className={styles.hiddenInput}
            />
        </div>
    )
}