-- ====================================================================
-- ONUADO NA EYE MENS' FELLOWSHIP - PRODUCTION DATABASE & RLS SECURITY SCRIPT
-- Copy and execute this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES FOR FELLOWSHIP ROLES & STATUS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('member', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE member_status AS ENUM ('ACTIVE', 'PROBATION', 'SUSPENDED', 'RESIGNED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (FELLOWSHIP MEMBERS)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    excel_member_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    momo_number TEXT,
    home_address TEXT,
    emergency_contact TEXT,
    branch TEXT DEFAULT 'Takoradi',
    title TEXT DEFAULT 'Elder',
    position TEXT DEFAULT 'Fellowship Member',
    role user_role DEFAULT 'member',
    status member_status DEFAULT 'ACTIVE',
    date_joined TEXT DEFAULT 'January 2023',
    reg_fees DECIMAL(10,2) DEFAULT 200.00,
    dues_paid DECIMAL(10,2) DEFAULT 0.00,
    levy_paid DECIMAL(10,2) DEFAULT 0.00,
    total_payments DECIMAL(10,2) DEFAULT 0.00,
    dues_fee_required DECIMAL(10,2) DEFAULT 3900.00,
    shares_dividends INT DEFAULT 0,
    shares_value DECIMAL(10,2) DEFAULT 0.00,
    treasurer_bill DECIMAL(10,2) DEFAULT 0.00,
    shares_holding DECIMAL(10,2) DEFAULT 0.00,
    balance_owed DECIMAL(10,2) DEFAULT 0.00,
    profile_picture TEXT,
    pin_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. CONTRIBUTIONS LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.contributions (
    id BIGSERIAL PRIMARY KEY,
    member_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    contribution_type TEXT NOT NULL, -- 'Monthly Dues', 'Welfare Fund', 'Registration Fee', 'Levy'
    payment_method TEXT NOT NULL,   -- 'Mobile Money', 'Cash', 'Fidelity Bank Transfer'
    reference_note TEXT,            -- e.g. "MTN Trans ID 29365899 or Dues Jan 2026"
    received_by UUID REFERENCES public.profiles(id), -- Admin who verified the transaction
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id),
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. INDEXES FOR PERFORMANCE & FAST LOOKUPS
CREATE INDEX IF NOT EXISTS idx_profiles_excel_id ON public.profiles(excel_member_id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_contributions_member ON public.contributions(member_id);
CREATE INDEX IF NOT EXISTS idx_contributions_date ON public.contributions(payment_date);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Helper Function to Check if Current User is an Executive Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- PROFILES POLICIES
-- --------------------------------------------------------------------
-- Policy 1: Members can view their own profile; Admins can view ALL profiles
CREATE POLICY "Members view own profile OR Admin views all profiles" 
ON public.profiles FOR SELECT 
USING (
  auth.uid() = id OR public.is_admin()
);

-- Policy 2: Members can update their own contact details (phone, address, avatar)
CREATE POLICY "Members update own contact profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Only Executive Admins can insert new member profiles
CREATE POLICY "Only Admins insert member profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (public.is_admin());

-- Policy 4: Only Executive Admins can delete profiles
CREATE POLICY "Only Admins delete profiles" 
ON public.profiles FOR DELETE 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- CONTRIBUTIONS LEDGER POLICIES
-- --------------------------------------------------------------------
-- Policy 1: Members can ONLY view their own payments; Admins can view ALL payments
CREATE POLICY "Members view own payments OR Admin views all payments" 
ON public.contributions FOR SELECT 
USING (
  member_id = auth.uid() OR public.is_admin()
);

-- Policy 2: Only Executive Admins can record new payment contributions
CREATE POLICY "Only Admins insert payments" 
ON public.contributions FOR INSERT 
WITH CHECK (public.is_admin());

-- Policy 3: Only Executive Admins can update payment records
CREATE POLICY "Only Admins update payments" 
ON public.contributions FOR UPDATE 
USING (public.is_admin());

-- --------------------------------------------------------------------
-- ANNOUNCEMENTS POLICIES
-- --------------------------------------------------------------------
-- Policy 1: All authenticated members can view executive announcements
CREATE POLICY "Members view announcements" 
ON public.announcements FOR SELECT 
USING (auth.role() = 'authenticated');

-- Policy 2: Only Executive Admins can post or delete announcements
CREATE POLICY "Only Admins manage announcements" 
ON public.announcements FOR ALL 
USING (public.is_admin());

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, excel_member_id, full_name, phone_number, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'excel_member_id', 'ONY-0' || SUBSTRING(new.id::text, 1, 3)),
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Member'),
    COALESCE(new.raw_user_meta_data->>'phone_number', new.email),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'member'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- SUCCESS MSG: RLS SECURITY SCHEME IMPLEMENTED FOR ONUADO NA EYE
-- ====================================================================
