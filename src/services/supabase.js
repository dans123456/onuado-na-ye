import { createClient } from '@supabase/supabase-js';

// Read credentials from environment variables or fallback gracefully
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SQL_SCHEMA_SCRIPT = `-- ==========================================
-- ONUADO NA YE FELLOWSHIP - DATABASE SCHEMA
-- Execute in Supabase SQL Editor
-- ==========================================

-- 1. Profiles Table (24 Fellowship Members)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    excel_member_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    momo_number TEXT,
    home_address TEXT,
    emergency_contact TEXT,
    role TEXT DEFAULT 'member', -- 'member' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Contributions Ledger Table
CREATE TABLE IF NOT EXISTS public.contributions (
    id BIGSERIAL PRIMARY KEY,
    member_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    contribution_type TEXT NOT NULL, -- 'Monthly Dues', 'Welfare Fund', 'Special Donation'
    payment_method TEXT NOT NULL,   -- 'Cash', 'Mobile Money'
    reference_note TEXT,            -- e.g., "MoMo Trans ID or Receipt Reference"
    received_by UUID REFERENCES public.profiles(id), -- Admin who logged it
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Policies for public reading of profiles or authenticated access
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow members to read own contributions" ON public.contributions FOR SELECT USING (true);
CREATE POLICY "Allow admins to insert contributions" ON public.contributions FOR INSERT WITH CHECK (true);
`;
