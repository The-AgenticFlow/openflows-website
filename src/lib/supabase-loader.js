import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Creates a loader for Astro Content Layer that fetches from Supabase.
 * Only loads published content for public pages.
 */
export function supabaseLoader(tableName) {
  return async function loader() {
    if (!supabase) {
      console.warn(`Supabase not configured. ${tableName} collection will be empty.`);
      return [];
    }

    let query = supabase.from(tableName).select('*');

    // Filter by status for blogs and research
    if (tableName === 'blogs' || tableName === 'research') {
      query = query.eq('status', 'published');
    }

    // Filter out soft-deleted blogs
    if (tableName === 'blogs') {
      query = query.is('deleted_at', null);
    }

    // Order by date
    if (tableName === 'blogs') {
      query = query.order('published_at', { ascending: false });
    } else if (tableName === 'research') {
      query = query.order('publish_date', { ascending: false });
    } else if (tableName === 'stories') {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error loading ${tableName}:`, error);
      return [];
    }

    // Transform data for Astro content layer
    return (data || []).map((item) => ({
      id: item.id,
      ...item,
      // Convert date strings to Date objects
      published_at: item.published_at ? new Date(item.published_at) : undefined,
      publish_date: item.publish_date ? new Date(item.publish_date) : undefined,
      created_at: item.created_at ? new Date(item.created_at) : undefined,
      updated_at: item.updated_at ? new Date(item.updated_at) : undefined,
      deleted_at: item.deleted_at ? new Date(item.deleted_at) : undefined,
    }));
  };
}
