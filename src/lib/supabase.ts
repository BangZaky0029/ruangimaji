// C:\codingVibes\landingPages\PersonalPortfolio\ruang-imaji\src\lib\supabase.ts
// Supabase client configuration for RUANG-IMAJI

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mrzqzbqocotkxttwvtqm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yenF6YnFvY290a3h0dHd2dHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0OTczNTMsImV4cCI6MjA4NTA3MzM1M30.Ei4zrVtsGdWZPykyHIQ0GwdDZXG6Ykzg5N1-rsFYsrY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase environment variables. Check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional helper (biar konsisten)
export const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET as string;
