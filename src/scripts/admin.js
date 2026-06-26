// Admin panel client-side JavaScript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => Boolean(supabase);

// Auth helpers
export async function signIn(email, password) {
    if (!supabase) {
        return { success: false, error: 'Supabase is not configured' };
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return { success: true, user: data.user };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

export async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
}

export async function getSession() {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

// Fetch admin user data
export async function fetchAdminUser(email) {
    if (!supabase || !email) return null;

    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)
            .single();

        if (error) return null;
        return data;
    } catch {
        return null;
    }
}

// Blog CRUD operations
export async function fetchBlogs(filters = {}) {
    if (!supabase) return [];

    let query = supabase
        .from('blogs')
        .select(`
      id,
      title,
      slug,
      excerpt,
      cover_image_url,
      status,
      published_at,
      created_at,
      view_count,
      is_featured,
      category:blog_categories(name, slug)
    `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }
    return data || [];
}

export async function fetchBlogStats() {
    if (!supabase) return { total: 0, published: 0, drafts: 0, archived: 0 };

    const { data } = await supabase
        .from('blogs')
        .select('status')
        .is('deleted_at', null);

    if (!data) return { total: 0, published: 0, drafts: 0, archived: 0 };

    return {
        total: data.length,
        published: data.filter(b => b.status === 'published').length,
        drafts: data.filter(b => b.status === 'draft').length,
        archived: data.filter(b => b.status === 'archived').length,
    };
}

export async function createBlog(blogData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('blogs')
        .insert({
            ...blogData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function updateBlog(id, blogData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('blogs')
        .update({
            ...blogData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function deleteBlog(id) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
        .from('blogs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

// Category operations
export async function fetchCategories() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
}

export async function createCategory(categoryData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('blog_categories')
        .insert({
            ...categoryData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function updateCategory(id, categoryData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('blog_categories')
        .update({
            ...categoryData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function deleteCategory(id) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

// Research operations
export async function fetchResearch() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('research')
        .select('*')
        .order('publish_date', { ascending: false });

    if (error) {
        console.error('Error fetching research:', error);
        return [];
    }
    return data || [];
}

export async function createResearch(researchData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('research')
        .insert({
            ...researchData,
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function updateResearch(id, researchData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('research')
        .update({
            ...researchData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function deleteResearch(id) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
        .from('research')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

// Stories operations
export async function fetchStories() {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
    return data || [];
}

export async function createStory(storyData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('stories')
        .insert({
            ...storyData,
            created_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function updateStory(id, storyData) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { data, error } = await supabase
        .from('stories')
        .update({
            ...storyData,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

    if (error) return { error: error.message };
    return { data };
}

export async function deleteStory(id) {
    if (!supabase) return { error: 'Supabase not configured' };

    const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);

    if (error) return { error: error.message };
    return { success: true };
}

// Utility functions
export function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function calculateReadTime(content) {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}
