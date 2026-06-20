import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Supabase credentials not found. Blog features will be disabled. ' +
        'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    )
}

export const supabase = supabaseUrl && supabaseAnonKey
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