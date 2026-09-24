import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dupxcvmbbjtvfcxteuvq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1cHhjdm1iYmp0dmZjeHRldXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjQ3ODIsImV4cCI6MjEwNTg0MDc4Mn0.EhC3JodWwPeW4tY9c9eBoARof6MylVhuUBEmKJFWL9Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
