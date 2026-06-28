import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false
    try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
        return false
    }
}

const credentialsValid = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey.length > 0

if (!credentialsValid) {
    console.warn(
        'Supabase credentials not found or invalid. Blog features will be disabled. ' +
        'Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in your .env file.'
    )
}

export const supabase = credentialsValid
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Storage bucket names
export const BLOG_IMAGES_BUCKET = 'blog-images'
export const BLOG_VIDEOS_BUCKET = 'blog-videos'

// Table names
export const TABLES = {
    BLOGS: 'blogs',
    BLOG_TAGS: 'blog_tags',
    BLOG_CATEGORIES: 'blog_categories',
    ADMIN_USERS: 'admin_users',
    STORIES: 'stories',
    RESEARCH: 'research',
}

// Blog status enum
export const BLOG_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived',
}

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
    return Boolean(supabaseUrl && supabaseAnonKey)
}